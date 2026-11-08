import { orderModel } from "../../models/food-order.model";

export const getUserOrdersController = async (req, res) => {
  try {
    const userId = req.userId;

    const orders = await orderModel
      .find({ user: userId })
      .sort({ createdAt: -1 });

    if (!orders) {
      return res
        .status(404)
        .json({ message: "No orders found for this user." });
    }

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
