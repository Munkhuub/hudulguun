import { categoryModel } from "../../models/food-category.model";

export const createCategoryController = async (req, res) => {
  const categories = req.body?.categories;
  if (!Array.isArray(categories) || categories.length === 0) {
    return res.status(400).json({ message: "categories must be a non-empty array" });
  }
  const names = categories.map((c) => String(c?.categoryName ?? "").trim());
  if (names.some((n) => !n)) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const now = new Date();
    await categoryModel.insertMany(
      names.map((categoryName) => ({ categoryName, createdAt: now, updatedAt: now }))
    );
    return res.status(201).json({ message: "Category created" });
  } catch (error) {
    console.error("Create category failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
