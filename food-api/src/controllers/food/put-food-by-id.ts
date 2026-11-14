import { isValidObjectId } from "mongoose";
import { foodModel } from "../../models/food.model";
import { validateFood } from "./validate-food";

export const putFoodById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) return res.status(400).json({ message: "Invalid id" });

  const result = validateFood(req.body);
  if ("error" in result) return res.status(400).json({ message: result.error });

  try {
    const updatedFood = await foodModel.findByIdAndUpdate(
      id,
      { ...result.data, updatedAt: new Date() },
      { new: true }
    );
    if (!updatedFood) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ food: updatedFood });
  } catch (error) {
    console.error("Update food failed:", error);
    return res.status(500).json({ message: "Server Error" });
  }
};
