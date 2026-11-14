export const DISTRICTS = [
  "Баянгол",
  "Баянзүрх",
  "Сонгинохайрхан",
  "Сүхбаатар",
  "Хан-Уул",
  "Чингэлтэй",
  "Налайх",
  "Багануур",
  "Багахангай",
  "Орон нутаг",
] as const;

export const LAST_ORDER_KEY = "hg:lastOrder";

export const MESSENGER_URL = "https://m.me/Hudulguunmn";

// Optional — set in Vercel env to show bank transfer details on the confirmation page.
export const BANK = {
  name: process.env.NEXT_PUBLIC_BANK_NAME ?? "",
  account: process.env.NEXT_PUBLIC_BANK_ACCOUNT ?? "",
  holder: process.env.NEXT_PUBLIC_BANK_HOLDER ?? "",
};
