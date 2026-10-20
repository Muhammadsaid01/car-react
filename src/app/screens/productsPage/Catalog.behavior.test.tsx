import React, { act } from "react";
import { createRoot, Root } from "react-dom/client";
import { Provider } from "react-redux";
import { MemoryRouter, useLocation } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import Products from "./Products";
import ProductService from "../../services/ProductService";
import { store } from "../../store";
import theme from "../../MaterialTheme";
import { Product } from "../../../lib/types/product";
import { ProductCollection, ProductStatus, ProductCondition, ProductCategory } from "../../../lib/enums/product.enum";

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });
let host: HTMLDivElement, root: Root;
const add = jest.fn();
const car: Product = JSON.parse(JSON.stringify({ _id: "catalog-car", productName: "Test Car", productPrice: 49.95,
  productYear: 2024, productMileage: 12000, productCollection: ProductCollection.SEDAN,
  productStatus: ProductStatus.ACTIVE, productCondition: ProductCondition.NEW, productCategory: ProductCategory.GASOLINE,
  productImages: ["uploads/products/test.jpg"], productViews: 1, createdAt: new Date(), updatedAt: new Date() }));
function RouteProbe() { const location = useLocation(); return <output id="test-route">{location.pathname}{location.search}</output>; }
async function mount(path = "/products") {
  // eslint-disable-next-line testing-library/no-unnecessary-act -- Native createRoot needs act to flush effects; this is not a Testing Library render.
  await act(async () => { root.render(<Provider store={store}><ThemeProvider theme={theme}><MemoryRouter initialEntries={[path]}><Products onAdd={add} /><RouteProbe /></MemoryRouter></ThemeProvider></Provider>); });
}
function button(label: string) {
  const found = Array.from(document.querySelectorAll("button")).find(node => node.getAttribute("aria-label") === label || node.textContent?.trim() === label);
  if (!found) throw new Error(`Missing button: ${label}`);
  return found;
}
async function click(label: string) { await act(async () => { button(label).click(); }); }
async function change(selector: string, value: string) {
  const input = document.querySelector(selector) as HTMLInputElement | HTMLSelectElement;
  const prototype = input instanceof HTMLSelectElement ? HTMLSelectElement.prototype : HTMLInputElement.prototype;
  await act(async () => { Object.getOwnPropertyDescriptor(prototype, "value")!.set!.call(input, value); input.dispatchEvent(new Event(input instanceof HTMLSelectElement ? "change" : "input", { bubbles: true })); });
}
beforeEach(() => {
  host = document.createElement("div"); document.body.appendChild(host); root = createRoot(host);
  add.mockReset();
  jest.spyOn(ProductService.prototype, "getProductPage").mockResolvedValue({ products: [car], total: 19 });
});
afterEach(async () => { await act(async () => { root.unmount(); }); host.remove(); jest.restoreAllMocks(); });

test("search, sorting and category changes reset pagination while preserving other applied filters", async () => {
  await mount("/products?search=Test&collection=SEDAN&order=productViews&page=3");
  expect(ProductService.prototype.getProductPage).toHaveBeenLastCalledWith(expect.objectContaining({ page: 3, limit: 6, search: "Test", productCollection: "SEDAN", order: "productViews" }));
  await change("#catalog-sort", "productPrice");
  expect(ProductService.prototype.getProductPage).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, search: "Test", productCollection: "SEDAN", order: "productPrice" }));
  await click("2-sahifaga o‘tish");
  expect(ProductService.prototype.getProductPage).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2, search: "Test", productCollection: "SEDAN" }));
  await change("#catalog-search", "Updated");
  await click("Qidirish");
  expect(ProductService.prototype.getProductPage).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, search: "Updated", productCollection: "SEDAN" }));
  await act(async () => { (document.querySelector('input[name="catalog-collection"][value="SPORTS_CAR"]') as HTMLInputElement).click(); });
  expect(ProductService.prototype.getProductPage).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, search: "Updated", productCollection: "SPORTS_CAR" }));
  await click("Qidiruvni tozalash");
  expect(ProductService.prototype.getProductPage).toHaveBeenLastCalledWith(expect.objectContaining({ search: "", productCollection: "SPORTS_CAR" }));
});

test("mobile filter selection stays a draft until applied; reset clears the URL and all filters", async () => {
  await mount("/products?search=Test&collection=SEDAN&page=2");
  const service = ProductService.prototype.getProductPage as jest.Mock;
  const calls = service.mock.calls.length;
  await click("Filtrlarni ochish");
  await act(async () => { (document.querySelector('input[name="catalog-collection"][value="SUV"]') as HTMLInputElement).click(); });
  expect(service).toHaveBeenCalledTimes(calls);
  await click("Filtrlarni qo‘llash");
  expect(service).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, search: "Test", productCollection: "SUV" }));
  await click("Tozalash");
  expect(service).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1, search: "", productCollection: undefined, order: "createdAt" }));
  expect(document.querySelector("#test-route")!.textContent).toBe("/products?order=createdAt");
});

test("pagination uses the real total, disables the last next button and repairs an out-of-range URL", async () => {
  const service = ProductService.prototype.getProductPage as jest.Mock;
  service.mockResolvedValue({ products: [car], total: 7 });
  await mount("/products?page=99&collection=SEDAN");
  expect(service).toHaveBeenLastCalledWith(expect.objectContaining({ page: 2, productCollection: "SEDAN" }));
  expect(button("Keyingi sahifa").disabled).toBe(true);
  expect(document.querySelector('button[aria-label="3-sahifaga o‘tish"]')).toBeNull();
  expect(document.querySelector("#test-route")!.textContent).toContain("page=2");
});

test("loading, empty and request failure remain distinct and retry preserves the inquiry", async () => {
  const service = ProductService.prototype.getProductPage as jest.Mock;
  let reject!: (error: Error) => void;
  service.mockImplementationOnce(() => new Promise((_resolve, fail) => { reject = fail; }));
  await mount("/products?collection=SUV&search=Test");
  expect(document.querySelectorAll(".lux-catalog-skeleton")).toHaveLength(6);
  expect(document.querySelectorAll(".lux-catalog-card")).toHaveLength(0);
  await act(async () => { reject(new Error("Unavailable")); });
  expect(document.querySelector('[role="alert"]')!.textContent).toContain("Avtomobillarni yuklab bo‘lmadi.");
  service.mockResolvedValueOnce({ products: [], total: 0 });
  await click("Qayta urinish");
  expect(service).toHaveBeenLastCalledWith(expect.objectContaining({ productCollection: "SUV", search: "Test" }));
  expect(document.querySelector('[role="alert"]')).toBeNull();
  expect(document.body.textContent).toContain("Avtomobillar topilmadi.");
  expect(document.body.textContent).toContain("0 ta avtomobil");
});

test("a late catalog response cannot overwrite the newer category result", async () => {
  let old!: (value: { products: Product[]; total: number }) => void;
  let latest!: (value: { products: Product[]; total: number }) => void;
  (ProductService.prototype.getProductPage as jest.Mock).mockImplementation(inquiry => new Promise(resolve => { if (inquiry.productCollection === "SUV") latest = resolve; else old = resolve; }));
  await mount();
  await act(async () => { (document.querySelector('input[name="catalog-collection"][value="SUV"]') as HTMLInputElement).click(); });
  await act(async () => { latest({ products: [{ ...car, productName: "Current SUV" }], total: 1 }); });
  await act(async () => { old({ products: [{ ...car, productName: "Stale car" }], total: 1 }); });
  expect(document.querySelector(".lux-catalog-card h2")!.textContent).toBe("Current SUV");
});

test("card keeps cents, falls back for a missing image and passes the actual product to the cart", async () => {
  (ProductService.prototype.getProductPage as jest.Mock).mockResolvedValue({ products: [{ ...car, productImages: [] }], total: 1 });
  await mount();
  expect(document.querySelector(".lux-catalog-card-image img")!.getAttribute("src")).toBe("/assets/luxavto/car-placeholder.svg");
  expect(document.querySelector(".lux-catalog-price")!.textContent).toMatch(/49[.,]95/);
  await click("Test Car — savatga qo‘shish");
  expect(add).toHaveBeenCalledWith(expect.objectContaining({ _id: car._id, price: 49.95, quantity: 1 }));
  expect(document.querySelector(".lux-catalog-card-actions a")!.getAttribute("href")).toBe(`/products/${car._id}`);
});

test("all four original video sources open one at a time, stop on close and expose a retry fallback", async () => {
  const pause = jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(() => {});
  await mount();
  for (const [title, source] of [["BMW", "/video/BMW.mp4"], ["Avtomobil taqdimoti", "/video/Bugatti.mp4"], ["Lamborghini", "/video/Lamborghini.mp4"], ["Mercedes-Benz", "/video/Benz.mp4"]]) {
    await click(`${title} videosini ko‘rish`);
    const videos = document.querySelectorAll("video");
    expect(videos).toHaveLength(1);
    expect(videos[0].getAttribute("src")).toBe(source);
    expect(videos[0].controls).toBe(true); expect(videos[0].muted).toBe(true);
    await click("Videoni yopish");
    expect(document.querySelectorAll("video")).toHaveLength(0);
  }
  expect(pause).toHaveBeenCalledTimes(4);
  await click("BMW videosini ko‘rish");
  await act(async () => { document.querySelector("video")!.dispatchEvent(new Event("error")); });
  expect(document.querySelector('[role="alert"]')!.textContent).toContain("Videoni yuklab bo‘lmadi.");
  await click("Qayta urinish");
  expect(document.querySelector("video")!.getAttribute("src")).toBe("/video/BMW.mp4");
});

test("unverified location has no restaurant iframe or invented destination", async () => {
  await mount();
  expect(document.querySelector(".lux-catalog-location iframe")).toBeNull();
  expect(document.querySelector(".lux-catalog-map-link")).toBeNull();
  expect(document.querySelector(".lux-catalog-location")!.textContent).toContain("Manzil tasdiqlanmoqda.");
});
