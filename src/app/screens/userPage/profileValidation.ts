import { Member } from "../../../lib/types/member";
export const PROFILE_TEXT_LIMIT = 2000;
export const PROFILE_IMAGE_LIMIT = 5 * 1024 * 1024;
export const profileFields = ["memberNick", "memberPhone", "memberAddress", "memberDesc"] as const;
export type ProfileField = typeof profileFields[number];
export type ProfileDraft = Record<ProfileField, string>;
export type ProfileErrors = Partial<Record<ProfileField, string>>;
export const profileDraft = (member: Member): ProfileDraft => ({ memberNick: member.memberNick ?? "", memberPhone: member.memberPhone ?? "", memberAddress: member.memberAddress ?? "", memberDesc: member.memberDesc ?? "" });
export function validateProfile(draft: ProfileDraft): ProfileErrors {
  const errors: ProfileErrors = {};
  if (!draft.memberNick.trim()) errors.memberNick = "Foydalanuvchi nomini kiriting.";
  if (!draft.memberPhone.trim()) errors.memberPhone = "Telefon raqamini kiriting.";
  // The API accepts international and locally formatted phone strings; it has no country-specific pattern.
  for (const key of profileFields) if (draft[key].length > PROFILE_TEXT_LIMIT) errors[key] = `Ko‘pi bilan ${PROFILE_TEXT_LIMIT} belgi kiriting.`;
  return errors;
}
export function imageError(file: File): string | undefined {
  const name = file.name.toLowerCase();
  const valid = file.type === "image/png" ? name.endsWith(".png") : ["image/jpeg", "image/jpg"].includes(file.type) && /\.jpe?g$/.test(name);
  if (!valid) return "Faqat JPG, JPEG yoki PNG rasmini tanlang.";
  if (file.size > PROFILE_IMAGE_LIMIT) return "Rasm hajmi 5 MiB dan oshmasligi kerak.";
}
export function profileRequestError(error: unknown): string {
  const failure = error as { response?: { status?: number; data?: { message?: string } }; message?: string };
  const message = failure?.response?.data?.message ?? failure?.message;
  if (message === "The nickname or phone number is already in use.") return "Bu foydalanuvchi nomi yoki telefon raqami allaqachon band. Boshqasini kiriting.";
  if (failure?.response?.status === 401) return "Sessiya tugagan. Qayta kiring va yana urinib ko‘ring.";
  if (message === "The selected file is not a valid JPEG or PNG image.") return "Fayl haqiqiy JPEG yoki PNG rasmi emas. Boshqa rasm tanlang.";
  if (message === "Profile image must be 5 MiB or smaller.") return "Rasm hajmi 5 MiB dan oshmasligi kerak.";
  if (message === "Only images with jpeg, jpg, png format allowed!") return "Faqat JPG, JPEG yoki PNG rasmini tanlang.";
  return "O‘zgarishlarni saqlab bo‘lmadi. Kiritilgan ma’lumotlar formada saqlanib qoldi; qayta urinib ko‘ring.";
}
