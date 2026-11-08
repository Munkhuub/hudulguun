import { foodModel } from "../../models/food.model";

export const countAllFood = async (req, res) => {
  try {
    const countAllFood = await foodModel.find({}).countDocuments();
    return res.status(200).json({ countAllFood });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message || "Unknown error",
    });
  }
};
