import axios from "axios";
import { serverApi } from "../../lib/config";
import { Product, ProductInquiry } from "../../lib/types/product";

class ProductService {
  private readonly path: string;

  constructor() {
    this.path = serverApi;
  }

  public async getProducts(input: ProductInquiry): Promise<Product[]> {
    return (await this.getProductPage(input)).products;
  }

  public async getProductPage(input: ProductInquiry): Promise<{ products: Product[]; total: number }> {
    try {
 
      let url = `${this.path}/product/all?order=${input.order}&page=${input.page}&limit=${input.limit}`;
      
      if (input.productCollection)
    
        url += `&productCollection=${input.productCollection}`;
      
      if (input.search) 
     
        url += `&search=${encodeURIComponent(input.search)}`;

      const result = await axios.get(url);
      console.log("getProducts:", result);

      const totalHeader = result.headers["x-total-count"];
      const total = Number(totalHeader);
      if (totalHeader === undefined || totalHeader === null || String(totalHeader).trim() === "" ||
          !Number.isSafeInteger(total) || total < 0 || !Array.isArray(result.data) || total < result.data.length) {
        throw new Error("Catalog response does not include an accurate total.");
      }
      return { products: result.data, total };
    } catch (err) {
      console.log("Error, getProduct:", err);
      throw err;
    }
  }

  public async getProduct(productId: string): Promise<Product> {
    try {
      // FIX: Added backticks ` around this URL
      const url = `${this.path}/product/${productId}`;
      const result = await axios.get(url, { withCredentials: true });
      console.log("getProduct:", result);

      return result.data;
    } catch (err) {
      console.log("Error, getProduct:", err);
      throw err;
    }
  }
}

export default ProductService;