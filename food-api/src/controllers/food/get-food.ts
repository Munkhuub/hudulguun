import { foodModel } from "../../models/food.model";

export const getFood = async (req, res) => {
  const { categoryId } = req.query;

  try {
    const food = await foodModel
      .find({ category: categoryId })
      .populate("category");
    return res.status(200).json({ food });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message || "Unknown error",
    });
  }
};
