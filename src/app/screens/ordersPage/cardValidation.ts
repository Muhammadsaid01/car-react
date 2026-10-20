export interface CardFields { number: string; expiry: string; cvv: string; holder: string; }
export type CardErrors = Partial<Record<keyof CardFields, string>>;
export const emptyCard = (): CardFields => ({ number: "", expiry: "", cvv: "", holder: "" });
export const formatCardNumber = (value: string) => value.replace(/\D/g, "").slice(0, 19).replace(/(.{4})/g, "$1 ").trim();
export const formatExpiry = (value: string) => value.replace(/\D/g, "").slice(0, 4).replace(/^(\d{2})(\d)/, "$1/$2");
export function validateCard(fields: CardFields, now = new Date()): CardErrors {
  const errors: CardErrors = {};
  const digits = fields.number.replace(/\s/g, "");
  let sum = 0;
  for (let index = 0; index < digits.length; index++) {
    let digit = Number(digits[digits.length - 1 - index]);
    if (index % 2) { digit *= 2; if (digit > 9) digit -= 9; }
    sum += digit;
  }
  if (!/^\d{13,19}$/.test(digits) || sum % 10 !== 0 || /^0+$/.test(digits)) errors.number = "Karta raqamini tekshiring.";
  const match = /^(\d{2})\/(\d{2})$/.exec(fields.expiry);
  const month = Number(match?.[1]), year = 2000 + Number(match?.[2]);
  if (!match || month < 1 || month > 12) errors.expiry = "Muddatni OO/YY shaklida kiriting.";
  else if (year < now.getFullYear() || (year === now.getFullYear() && month < now.getMonth() + 1)) errors.expiry = "Kartaning amal qilish muddati tugagan.";
  if (!/^\d{3,4}$/.test(fields.cvv)) errors.cvv = "CVV 3 yoki 4 raqamdan iborat bo‘lishi kerak.";
  if (fields.holder.trim().length < 2 || !/[a-zA-ZÀ-žА-Яа-я]/.test(fields.holder)) errors.holder = "Karta egasining ism va familiyasini kiriting.";
  return errors;
}
