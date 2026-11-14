import { isValidObjectId } from "mongoose";
import { foodModel } from "../../models/food.model";

export const getFoodById = async (req, res) => {
  const { id } = req.params;
  if (!isValidObjectId(id)) {
    return res.status(400).json({ message: "Invalid id" });
  }
  try {
    const food = await foodModel.findById(id).populate("category");
    if (!food) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ food });
  } catch (error) {
    console.error("Get food failed:", error);
    res.status(500).json({ message: "Server Error" });
  }
};
