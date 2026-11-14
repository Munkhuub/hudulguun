import { isValidObjectId } from "mongoose";
import { categoryModel } from "../../models/food-category.model";
import { foodModel } from "../../models/food.model";

export const deleteFoodCategoryById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    // Don't orphan products: they would disappear from the shop and break orders.
    const productCount = await foodModel.countDocuments({ category: id });
    if (productCount > 0) {
      return res.status(409).json({ message: "Category still has products", productCount });
    }
    const category = await categoryModel.findByIdAndDelete(id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    return res.status(200).json({ category });
  } catch (error) {
    console.error("Delete category failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
