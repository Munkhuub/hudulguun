import { foodModel } from "../../models/food.model";

export const countFood = async (req, res) => {
  const { categoryId } = req.query;
  try {
    const countFood = await foodModel
      .find({ category: categoryId })
      .countDocuments();
    return res.status(200).json({ countFood });
  } catch (error) {
    console.error("Error details:", error);
    res.status(500).json({
      message: "Server Error",
      error: error.message || "Unknown error",
    });
  }
};
