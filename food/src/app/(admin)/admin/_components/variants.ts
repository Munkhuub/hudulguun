// Admin enters colour options as one comma-separated line.
export const parseVariants = (text: string): string[] => [
  ...new Set(
    text
      .split(",")
      .map((v) => v.trim())
      .filter(Boolean)
  ),
];

export const VARIANTS_HINT = "Таслалаар тусгаарлана. Жишээ: Бүдэг өнгө, Тод өнгө. Хоосон бол өнгө сонгохгүй.";
