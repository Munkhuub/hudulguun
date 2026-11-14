import { categoryModel } from "../../models/food-category.model";

export const getFoodCategory = async (_req, res) => {
  try {
    const categories = await categoryModel.find({}).sort({ createdAt: 1 });
    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Get categories failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
