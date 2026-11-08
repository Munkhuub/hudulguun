import { categoryModel } from "../../models/food-category.model";

export const putFoodCategoryById = async (req, res) => {
  const { categoryName } = req.body;

  const { id } = req.params;

  const category = await categoryModel.findByIdAndUpdate(id, {
    categoryName,
  });

  return res.status(200).json({ category });
};
