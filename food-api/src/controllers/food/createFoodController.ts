import { foodModel } from "../../models/food.model";

export const createFoodController = async (req, res) => {
  const { foods } = req.body;

  try {
    const allFood = foods.map((food) => ({
      foodName: food.foodName,
      price: food.price,
      image: food.image,
      ingredients: food.ingredients,
      category: food.category,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    await foodModel.insertMany(allFood);
    return res.status(201).json({ message: "Hool shit nemegdsen" });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
