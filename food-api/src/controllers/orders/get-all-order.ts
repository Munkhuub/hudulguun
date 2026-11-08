import { orderModel } from "../../models/food-order.model";

export const getAllOrder = async (req, res) => {
  try {
    const order = await orderModel
      .find({})
      .populate("foodOrderItems.food")
      .populate("user", "-password")
      .sort({ createdAt: -1 });
    return res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
