import { orderModel, ORDER_STATUSES } from "../../models/food-order.model";

const STATUSES: readonly string[] = ORDER_STATUSES;

// Admin-only: only the status of an order can be changed.
export const putOrderById = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body ?? {};

  if (!STATUSES.includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const order = await orderModel.findByIdAndUpdate(
      id,
      { status, updatedAt: new Date() },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: "Order not found" });
    return res.status(200).json({ order });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
