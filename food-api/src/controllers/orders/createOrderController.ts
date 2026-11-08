import { isValidObjectId } from "mongoose";
import { orderModel } from "../../models/food-order.model";
import { foodModel } from "../../models/food.model";

const MAX_QTY_PER_ITEM = 99;

// The client only sends WHAT it wants; prices and totals are computed here.
export const createOrderController = async (req, res) => {
  const items = req.body?.foodOrderItems;

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return res.status(400).json({ message: "Order must contain items" });
  }

  // Merge duplicates and validate.
  const quantities = new Map<string, number>();
  for (const item of items) {
    const id = String(item?.food ?? "");
    const qty = Number(item?.quantity);
    if (!isValidObjectId(id) || !Number.isInteger(qty) || qty < 1) {
      return res.status(400).json({ message: "Invalid order item" });
    }
    quantities.set(id, (quantities.get(id) ?? 0) + qty);
  }
  for (const qty of quantities.values()) {
    if (qty > MAX_QTY_PER_ITEM) {
      return res.status(400).json({ message: "Quantity too large" });
    }
  }

  try {
    const ids = [...quantities.keys()];
    const products = await foodModel.find({ _id: { $in: ids } }).select("price");
    if (products.length !== ids.length) {
      return res.status(400).json({ message: "Some products no longer exist" });
    }

    const totalPrice = products.reduce(
      (sum, p) => sum + p.price * quantities.get(String(p._id))!,
      0
    );

    const now = new Date();
    const order = await orderModel.create({
      user: req.userId,
      totalPrice,
      foodOrderItems: ids.map((food) => ({ food, quantity: quantities.get(food) })),
      status: "Pending",
      createdAt: now,
      updatedAt: now,
    });

    return res.status(201).json(order);
  } catch (error) {
    console.error("Create order failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};
