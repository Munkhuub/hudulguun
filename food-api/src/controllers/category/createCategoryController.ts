import { categoryModel } from "../../models/food-category.model";

export const createCategoryController = async (req, res) => {
  const { categories } = req.body;
  try {
    const allCategories = categories.map((category) => ({
      categoryName: category.categoryName,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await categoryModel.insertMany(allCategories);
    return res.status(201).json({ message: "Category nemegdsen" });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message || "Unknown error",
    });
  }
};
