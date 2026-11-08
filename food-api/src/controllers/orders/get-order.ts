import { orderModel } from "../../models/food-order.model";

export const getOrder = async (req, res) => {
  try {
    const order = await orderModel
      .find({ user: req.userId })
      .populate("foodOrderItems.food")
      .sort({ createdAt: -1 });
    return res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};
