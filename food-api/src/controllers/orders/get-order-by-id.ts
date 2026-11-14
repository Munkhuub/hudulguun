import { orderModel } from "../../models/food-order.model";

export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await orderModel.findById(id).populate("foodOrderItems.food");
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (!order.user || String(order.user) !== req.userId && !req.isAdmin) {
      return res.status(403).json({ message: "Forbidden" });
    }
    return res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
