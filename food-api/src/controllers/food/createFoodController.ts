import { foodModel } from "../../models/food.model";
import { validateFood } from "./validate-food";

export const createFoodController = async (req, res) => {
  const foods = req.body?.foods;
  if (!Array.isArray(foods) || foods.length === 0) {
    return res.status(400).json({ message: "foods must be a non-empty array" });
  }

  const now = new Date();
  const docs = [];
  for (const food of foods) {
    const result = validateFood(food);
    if ("error" in result) return res.status(400).json({ message: result.error });
    docs.push({ ...result.data, createdAt: now, updatedAt: now });
  }

  try {
    await foodModel.insertMany(docs);
    return res.status(201).json({ message: "Products created" });
  } catch (error) {
    console.error("Create foods failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
