import { foodModel } from "../../models/food.model";
import { validateFood } from "./validate-food";

export const createOneFoodController = async (req, res) => {
  const result = validateFood(req.body);
  if ("error" in result) return res.status(400).json({ message: result.error });

  try {
    const now = new Date();
    const food = await foodModel.create({ ...result.data, createdAt: now, updatedAt: now });
    return res.status(201).json({ food });
  } catch (error) {
    console.error("Create food failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
