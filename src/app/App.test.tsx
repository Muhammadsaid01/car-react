import React from "react";
import userEvent from "@testing-library/user-event";
import { act, render } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import App from "./App";
import ContextProvider from "./context/ContextProvider";
import MemberService from "./services/MemberService";
import ProductService from "./services/ProductService";
import { store } from "./store";
import OrderService from "./services/OrderService";
import { Member } from "../lib/types/member";
import { Product } from "../lib/types/product";
import { MemberStatus, MemberType } from "../lib/enums/member.enum";
import { ProductCategory, ProductCollection, ProductCondition, ProductStatus } from "../lib/enums/product.enum";
import { Order } from "../lib/types/order";
import { OrderStatus } from "../lib/enums/order.enum";
import theme from "./MaterialTheme";
import * as alerts from "../lib/sweetAlert";
import { serverApi } from "../lib/config";

const testMember: Member = {
  _id: "test-member", memberNick: "Test Member", memberPhone: "test-phone", memberAddress: "Test address",
  memberDesc: "Test profile", memberType: MemberType.USER, memberStatus: MemberStatus.ACTIVE,
  memberPoints: 0, createdAt: new Date(), updatedAt: new Date(),
};
const testProduct: Product = JSON.parse(JSON.stringify({
  _id: "test-car", productName: "Test Car", productPrice: 105, productStatus: ProductStatus.ACTIVE,
  productCollection: ProductCollection.SEDAN, productCondition: ProductCondition.NEW,
  productCategory: ProductCategory.GASOLINE, productYear: 2026, productMileage: 0,
  productImages: ["uploads/products/test.png"], productViews: 0, createdAt: new Date(), updatedAt: new Date(),
}));

beforeEach(() => {
  localStorage.clear();
  jest.spyOn(OrderService.prototype, "getMyOrders").mockResolvedValue([]);
  jest.spyOn(MemberService.prototype, "getMemberDetail").mockRejectedValue(new Error("Unauthenticated"));
  jest.spyOn(MemberService.prototype, "getTopUsers").mockResolvedValue([]);
  jest.spyOn(ProductService.prototype, "getProducts").mockResolvedValue([]);
  jest.spyOn(ProductService.prototype, "getProductPage").mockResolvedValue({ products: [], total: 0 });
});
afterEach(() => jest.restoreAllMocks());

async function renderApp(path = "/help") {
  let page: ReturnType<typeof render> | undefined;
  await act(async () => {
    page = render(
    <Provider store={store}>
      <ContextProvider>
        <ThemeProvider theme={theme}>
          <MemoryRouter initialEntries={[path]}><App /></MemoryRouter>
        </ThemeProvider>
      </ContextProvider>
    </Provider>
    );
  });
  return page!;
}

test("renders help and navigates to the catalog through the existing navbar", async () => {
  const page = await renderApp();
  expect(page.getByText("TERMS")).toBeInTheDocument();
  await act(async () => { page.getByText("Cars").click(); });
  expect(page.getByText("Cars are not available!")).toBeInTheDocument();
  expect(ProductService.prototype.getProductPage).toHaveBeenCalledWith(expect.objectContaining({ page: 1, limit: 8 }));
});

test("renders the home page with real Swiper modules and mocked API data", async () => {
  const page = await renderApp("/");
  expect(page.getByText("Events")).toBeInTheDocument();
  expect(page.getByText("New Cars")).toBeInTheDocument();
  expect(page.getByText("No Active Users!")).toBeInTheDocument();
});

test("does not trust stale localStorage to open a protected page", async () => {
  localStorage.setItem("memberData", JSON.stringify({ memberType: "ADMIN" }));
  const page = await renderApp("/member-page");
  expect(page.getByText("Events")).toBeInTheDocument();
  expect(page.queryByText("Modify Member Details")).toBeNull();
  expect(localStorage.getItem("memberData")).toBeNull();
});

test("restores an HttpOnly session before opening the member page", async () => {
  jest.spyOn(MemberService.prototype, "getMemberDetail").mockResolvedValue(testMember);
  const page = await renderApp("/member-page");
  expect(page.getByText("Modify Member Details")).toBeInTheDocument();
  expect((page.container.querySelector('[name="memberNick"]') as HTMLInputElement).value).toBe(testMember.memberNick);
  expect(JSON.parse(localStorage.getItem("memberData")!)._id).toBe(testMember._id);
});

test("catalog items persist in the cart and checkout opens the order page", async () => {
  jest.spyOn(MemberService.prototype, "getMemberDetail").mockResolvedValue(testMember);
  jest.spyOn(ProductService.prototype, "getProductPage").mockResolvedValue({ products: [testProduct], total: 1 });
  const create = jest.spyOn(OrderService.prototype, "createOrder").mockResolvedValue({
    _id: "test-order", orderTotal: 105, orderDelivery: 0, orderStatus: OrderStatus.PENDING,
    memberId: testMember._id, createdAt: new Date(), updatedAt: new Date(), orderItems: [], productData: [],
  });
  const page = await renderApp("/products");
  await act(async () => { page.getByAltText("Add to Cart").closest("button")!.click(); });
  expect(JSON.parse(localStorage.getItem("cartData")!)[0].quantity).toBe(1);
  await act(async () => { page.getByLabelText("cart").click(); });
  await act(async () => { page.getByText("Order").click(); });
  expect(create).toHaveBeenCalledWith([expect.objectContaining({ _id: testProduct._id, quantity: 1 })]);
  expect(localStorage.getItem("cartData")).toBeNull();
  expect(page.getByText("PAUSED ORDERS")).toBeInTheDocument();
});

test("catalog uses the exact last page and resets pagination when searching", async () => {
  const pageService = jest.spyOn(ProductService.prototype, "getProductPage").mockResolvedValue({ products: [testProduct], total: 17 });
  const page = await renderApp("/products");
  expect(page.queryByLabelText("Go to page 4")).toBeNull();
  await act(async () => { page.getByLabelText("Go to page 3").click(); });
  expect(pageService).toHaveBeenLastCalledWith(expect.objectContaining({ page: 3 }));
  await act(async () => { await userEvent.type(page.getByPlaceholderText("Type here"), "Test", { allAtOnce: true }); });
  await act(async () => { page.getByText("Search").click(); });
  expect(pageService).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, search: "Test" }));
});

test("login labels identify fields and validation preserves the entered username", async () => {
  const page = await renderApp();
  const login = jest.spyOn(MemberService.prototype, "login");
  await act(async () => { page.getByText("Login").click(); });
  await act(async () => { await userEvent.type(page.getByLabelText("username"), "Test Member", { allAtOnce: true }); });
  expect(page.getByLabelText("password").type).toBe("password");
  await act(async () => { (page.getByLabelText("password").closest("form").querySelector('button[type="submit"]') as HTMLButtonElement).click(); });
  expect(page.getByRole("alert").textContent).toBe("Please fulfill all inputs!");
  expect(page.getByLabelText("username").value).toBe("Test Member");
  expect(login).not.toHaveBeenCalled();
});

test("orders with a removed product remain readable", async () => {
  jest.spyOn(MemberService.prototype, "getMemberDetail").mockResolvedValue(testMember);
  jest.spyOn(OrderService.prototype, "getMyOrders").mockImplementation(async inquiry => inquiry.orderStatus === OrderStatus.PROCESS ? [{
    _id: "missing-car-order", memberId: testMember._id, orderTotal: 100, orderDelivery: 0,
    orderStatus: OrderStatus.PROCESS, createdAt: new Date(), updatedAt: new Date(), productData: [],
    orderItems: [{ _id: "item", productId: "removed", itemPrice: 100, itemQuantity: 1, createdAt: new Date(), updatedAt: new Date() }],
  }] : []);
  const page = await renderApp("/orders");
  await act(async () => { page.getByText("PROCESS ORDERS").click(); });
  expect(page.getByText("Unavailable car")).toBeInTheDocument();
});

for (const confirm of [false, true]) {
  test(`order cancellation respects confirmation=${confirm}`, async () => {
    jest.spyOn(MemberService.prototype, "getMemberDetail").mockResolvedValue(testMember);
    let status = OrderStatus.PENDING;
    const fixture: Order = JSON.parse(JSON.stringify({ _id: "confirm-order", memberId: testMember._id, orderStatus: status,
      orderTotal: 105, orderDelivery: 0, createdAt: new Date(), updatedAt: new Date(), productData: [testProduct],
      orderItems: [{ _id: "item", productId: testProduct._id, itemPrice: 105, itemQuantity: 1 }] }));
    jest.spyOn(OrderService.prototype, "getMyOrders").mockImplementation(async inquiry => inquiry.orderStatus === status ? [fixture] : []);
    const update = jest.spyOn(OrderService.prototype, "updateOrder").mockImplementation(async input => { status = input.orderStatus; return { ...fixture, orderStatus: status }; });
    jest.spyOn(window, "confirm").mockReturnValue(confirm);
    const page = await renderApp("/orders");
    await act(async () => { page.getByText("Cancel").click(); });
    expect(update).toHaveBeenCalledTimes(confirm ? 1 : 0);
    if (confirm) expect(update).toHaveBeenCalledWith({ orderId: fixture._id, orderStatus: OrderStatus.DELETE });
  });
}

test("confirmation advances pending to process to finished, while dismissal sends no update", async () => {
  jest.spyOn(MemberService.prototype, "getMemberDetail").mockResolvedValue(testMember);
  let status = OrderStatus.PENDING;
  const fixture: Order = JSON.parse(JSON.stringify({ _id: "transition-order", memberId: testMember._id,
    orderTotal: 105, orderDelivery: 0, createdAt: new Date(), updatedAt: new Date(), productData: [testProduct],
    orderItems: [{ _id: "item", productId: testProduct._id, itemPrice: 105, itemQuantity: 1 }] }));
  jest.spyOn(OrderService.prototype, "getMyOrders").mockImplementation(async inquiry => inquiry.orderStatus === status ? [{ ...fixture, orderStatus: status }] : []);
  const update = jest.spyOn(OrderService.prototype, "updateOrder").mockImplementation(async input => { status = input.orderStatus; return { ...fixture, orderStatus: status }; });
  const confirmation = jest.spyOn(window, "confirm").mockReturnValue(false);
  const page = await renderApp("/orders");
  await act(async () => { page.getByText("Payment").click(); });
  expect(update).not.toHaveBeenCalled();
  confirmation.mockReturnValue(true);
  await act(async () => { page.getByText("Payment").click(); });
  expect(update).toHaveBeenLastCalledWith({ orderId: fixture._id, orderStatus: OrderStatus.PROCESS });
  await act(async () => { page.getByText("Verify to Fulfil").click(); });
  expect(update).toHaveBeenLastCalledWith({ orderId: fixture._id, orderStatus: OrderStatus.FINISH });
  expect(page.getByText("FINISHED ORDERS").getAttribute("aria-selected")).toBe("true");
});

test("active users without an uploaded photo use the default avatar", async () => {
  jest.spyOn(MemberService.prototype, "getTopUsers").mockResolvedValue(JSON.parse(JSON.stringify([testMember])));
  const page = await renderApp("/");
  expect(page.getByAltText(testMember.memberNick).getAttribute("src")).toBe("/icons/default-user.svg");
});

test("profile rejects unsupported and oversized files with specific messages and keeps the saved photo", async () => {
  jest.spyOn(MemberService.prototype, "getMemberDetail").mockResolvedValue({ ...testMember, memberImage: "uploads/members/old.png" });
  const error = jest.spyOn(alerts, "sweetErrorHandling").mockResolvedValue(undefined);
  const update = jest.spyOn(MemberService.prototype, "updateMember");
  const page = await renderApp("/member-page");
  const input = page.getByLabelText("Profile image");
  for (const [file, message] of [
    [new File(["text"], "bad.txt", { type: "text/plain" }), "Only images with jpeg, jpg, png format allowed!"],
    [new File([new Uint8Array(5 * 1024 * 1024 + 1)], "large.png", { type: "image/png" }), "Profile image must be 5 MiB or smaller."],
  ] as const) {
    await act(async () => { Object.defineProperty(input, "files", { configurable: true, value: [file] }); input.dispatchEvent(new Event("change", { bubbles: true })); });
    expect(error).toHaveBeenLastCalledWith(expect.objectContaining({ message }));
    expect(page.getByAltText("Member").getAttribute("src")).toBe(`${serverApi}/uploads/members/old.png`);
  }
  expect(update).not.toHaveBeenCalled();
});

for (const failed of [false, true]) {
  test(`profile upload save failure=${failed} restores the correct image and releases the preview`, async () => {
    const saved = { ...testMember, memberImage: "uploads/members/old.png" };
    jest.spyOn(MemberService.prototype, "getMemberDetail").mockResolvedValue(saved);
    jest.spyOn(alerts, "sweetErrorHandling").mockResolvedValue(undefined);
    jest.spyOn(alerts, "sweetTopSmallSuccessAlert").mockResolvedValue(undefined);
    const update = jest.spyOn(MemberService.prototype, "updateMember");
    if (failed) update.mockRejectedValue(new Error("Upload failed"));
    else update.mockResolvedValue({ ...saved, memberImage: "uploads/members/new.png" });
    const create = jest.fn().mockReturnValue("blob:profile-preview");
    const revoke = jest.fn();
    Object.defineProperty(URL, "createObjectURL", { configurable: true, value: create });
    Object.defineProperty(URL, "revokeObjectURL", { configurable: true, value: revoke });
    const page = await renderApp("/member-page");
    const image = new File(["fixture"], "photo.png", { type: "image/png" });
    await act(async () => { const input = page.getByLabelText("Profile image"); Object.defineProperty(input, "files", { configurable: true, value: [image] }); input.dispatchEvent(new Event("change", { bubbles: true })); });
    expect(page.getByAltText("Member").getAttribute("src")).toBe("blob:profile-preview");
    await act(async () => { page.getByText("Save").click(); });
    expect(update).toHaveBeenLastCalledWith(expect.objectContaining({ memberImage: image }));
    expect(page.getByAltText("Member").getAttribute("src")).toBe(`${serverApi}/uploads/members/${failed ? "old" : "new"}.png`);
    expect(revoke).toHaveBeenCalledWith("blob:profile-preview");
    // A later text-only save must not resubmit the failed or already saved file.
    await act(async () => { page.getByText("Save").click(); });
    expect(update).toHaveBeenLastCalledWith(expect.objectContaining({ memberImage: `uploads/members/${failed ? "old" : "new"}.png` }));
    page.unmount();
    delete (URL as any).createObjectURL;
    delete (URL as any).revokeObjectURL;
  });
}
