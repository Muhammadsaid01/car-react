import { ProductCollection } from "./enums/product.enum";
import { ProductInquiry } from "./types/product";

export const collectionOptions = [
  { value: "", label: "Barchasi" },
  { value: ProductCollection.SEDAN, label: "Sedan" },
  { value: ProductCollection.SUV, label: "SUV" },
  { value: ProductCollection.COUPE, label: "Kupe" },
  { value: ProductCollection.CONVERTIBLE, label: "Kabriolet" },
  { value: ProductCollection.SPORT_CAR, label: "Sport" },
  { value: ProductCollection.HATCHBACK, label: "Xetchbek" },
  { value: ProductCollection.TRUCK, label: "Yuk avtomobili" },
  { value: ProductCollection.VAN, label: "Miniven" },
  { value: ProductCollection.OTHER, label: "Boshqa" },
];
export const sortOptions = [
  { value: "createdAt", label: "Yangilari avval" },
  { value: "productPrice", label: "Arzonlari avval" },
  { value: "productViews", label: "Mashhurlari avval" },
];
export function readCatalogSearch(search: string): ProductInquiry {
  const params = new URLSearchParams(search);
  const collection = params.get("collection") || "";
  const order = params.get("order") || "createdAt";
  const requestedPage = Number(params.get("page") || 1);
  return { page: Number.isSafeInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1, limit: 6,
    order: sortOptions.some(option => option.value === order) ? order : "createdAt",
    productCollection: collectionOptions.some(option => option.value === collection) && collection ? collection as ProductCollection : undefined,
    search: params.get("search")?.trim() || "",
  };
}
export function catalogUrl({ search = "", collection = "", order = "createdAt", page = 1 } = {}) {
  const params = new URLSearchParams();
  if (search.trim()) params.set("search", search.trim());
  if (collection) params.set("collection", collection);
  params.set("order", order);
  if (page > 1) params.set("page", String(page));
  return `/products?${params.toString()}`;
}
