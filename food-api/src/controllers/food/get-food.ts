import { isValidObjectId } from "mongoose";
import { foodModel } from "../../models/food.model";

export const getFood = async (req, res) => {
  const categoryId = req.query.categoryId;

  // No categoryId → all products. Invalid id → empty list instead of a cast error.
  if (categoryId !== undefined && !isValidObjectId(categoryId)) {
    return res.status(200).json({ food: [] });
  }

  try {
    const filter = categoryId ? { category: categoryId } : {};
    const food = await foodModel.find(filter).populate("category").sort({ createdAt: -1 });
    return res.status(200).json({ food });
  } catch (error) {
    console.error("Get foods failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
