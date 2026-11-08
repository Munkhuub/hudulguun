import { foodModel } from "../../models/food.model";

export const deleteFoodById = async (req, res) => {
  const { id } = req.params;

  try {
    const food = await foodModel.findByIdAndDelete(id);

    return res.status(200).json({ food });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
