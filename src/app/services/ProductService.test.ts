import axios from "axios";
import ProductService from "./ProductService";
afterEach(() => jest.restoreAllMocks());
test("catalog requires a valid exposed total rather than inventing a result count", async () => {
  const get = jest.spyOn(axios, "get");
  for (const headers of [{}, { "x-total-count": "invalid" }, { "x-total-count": "-1" }]) {
    get.mockResolvedValueOnce({ data: [], headers });
    await expect(new ProductService().getProductPage({ page: 1, limit: 6, order: "createdAt" })).rejects.toThrow("accurate total");
  }
  get.mockResolvedValueOnce({ data: [], headers: { "x-total-count": "0" } });
  await expect(new ProductService().getProductPage({ page: 1, limit: 6, order: "createdAt" })).resolves.toEqual({ products: [], total: 0 });
});
