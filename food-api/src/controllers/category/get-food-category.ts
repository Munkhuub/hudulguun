import { categoryModel } from "../../models/food-category.model";

export const getFoodCategory = async (req, res) => {
  const categories = await categoryModel.find({});
  return res.status(200).json({ categories });
};
