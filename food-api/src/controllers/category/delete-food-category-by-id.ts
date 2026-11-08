import { categoryModel } from "../../models/food-category.model";

export const deleteFoodCategoryById = async (req, res) => {
  const { id } = req.params;

  const category = await categoryModel.findByIdAndDelete(id);

  return res.status(200).json({ category });
};
