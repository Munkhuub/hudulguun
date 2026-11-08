import { foodModel } from "../../models/food.model";

export const createOneFoodController = async (req, res) => {
  const { foodName, price, image, ingredients, category } = req.body;

  try {
    await foodModel.create({
      foodName,
      price,
      image,
      ingredients,
      category,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.status(201).json({ message: "Hool shit nemegdsen" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
