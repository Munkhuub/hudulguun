import { isValidObjectId } from "mongoose";
import { categoryModel } from "../../models/food-category.model";

export const putFoodCategoryById = async (req, res) => {
  const { id } = req.params;
  const categoryName = String(req.body?.categoryName ?? "").trim();

  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  if (!categoryName) {
    return res.status(400).json({ message: "Category name is required" });
  }

  try {
    const category = await categoryModel.findByIdAndUpdate(
      id,
      { categoryName, updatedAt: new Date() },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    return res.status(200).json({ category });
  } catch (error) {
    console.error("Update category failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
