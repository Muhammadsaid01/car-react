import { OrderStatus } from "../../../lib/enums/order.enum";
export const orderTabs = [
  { value: OrderStatus.PENDING, label: "Kutilmoqda" },
  { value: OrderStatus.PROCESS, label: "Jarayonda" },
  { value: OrderStatus.FINISH, label: "Yakunlangan" },
];
export const orderReference = (id: string) => `#LX-${id.slice(-8).toUpperCase()}`;
export const money = (value: number) => new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 }).format(value);
export function orderDate(value: Date) {
  const date = new Date(value);
  const months = ["yanvar", "fevral", "mart", "aprel", "may", "iyun", "iyul", "avgust", "sentabr", "oktabr", "noyabr", "dekabr"];
  return Number.isNaN(date.getTime()) ? "Sana ko‘rsatilmagan" : `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
}
export type OrderAction = "cancel" | "confirm" | "finish";
export const nextStatus = { cancel: OrderStatus.DELETE, confirm: OrderStatus.PROCESS, finish: OrderStatus.FINISH };
export const canPay = (status: OrderStatus) => status === OrderStatus.PENDING || status === OrderStatus.PROCESS;
