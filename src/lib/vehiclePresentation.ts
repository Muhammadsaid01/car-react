import { serverApi } from "./config";
import { collectionOptions } from "./catalogSearch";
import { ProductCategory, ProductCondition } from "./enums/product.enum";
import { Product } from "./types/product";

export const validVehicleId = (value: string) => /^[a-f\d]{24}$/i.test(value);
export const vehicleBody = (value: string | undefined) => value === "SPORT_CAR" ? "Sport" : collectionOptions.find(option => option.value && option.value === value)?.label;
const fuels: Record<ProductCategory, string> = {
  GASOLINE: "Benzin", DIESEL: "Dizel", LPG: "Gaz", ELECTRIC: "Elektr", KERASENE: "Kerosin", OTHER: "Boshqa",
};
const conditions: Record<ProductCondition, string> = { NEW: "Yangi", USED: "Ishlatilgan", REFURBISHED: "Qayta tiklangan", CRASHED: "Shikastlangan" };
export const vehicleFuel = (value: ProductCategory) => fuels[value];
export const vehicleCondition = (value: ProductCondition) => conditions[value];
export const vehicleNumber = (value: number) => new Intl.NumberFormat("uz-UZ", { maximumFractionDigits: 2 }).format(value);
export const vehiclePrice = (value: number) => Number.isFinite(value) && value >= 0 ? new Intl.NumberFormat("uz-UZ", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(value) : "Narx kiritilmagan";
export function vehicleImageUrl(path: string): string | undefined {
  const value = path.trim().replace(/\\/g, "/");
  if (!value || value.startsWith("//") || /^[^/]*:/.test(value) && !/^https?:\/\//i.test(value)) return undefined;
  if (/^https?:\/\//i.test(value)) return value;
  return `${serverApi.replace(/\/+$/, "")}/${value.replace(/^(?:\.\/|\/)+/, "")}`;
}
export function vehicleSpecs(product: Product): { label: string; value: string; key: boolean }[] {
  const body = vehicleBody(product.productCollection), fuel = vehicleFuel(product.productCategory), condition = vehicleCondition(product.productCondition);
  return [
    ...(body ? [{ label: "Kuzov turi", value: body, key: false }] : []),
    ...(Number.isInteger(product.productYear) && product.productYear > 0 ? [{ label: "Yil", value: String(product.productYear), key: true }] : []),
    ...(Number.isFinite(product.productMileage) && product.productMileage >= 0 ? [{ label: "Yurgan masofa", value: `${vehicleNumber(product.productMileage)} km`, key: true }] : []),
    ...(fuel ? [{ label: "Yoqilg‘i", value: fuel, key: true }] : []),
    ...(condition ? [{ label: "Holati", value: condition, key: false }] : []),
  ];
}
