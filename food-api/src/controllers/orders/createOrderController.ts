import { isValidObjectId } from "mongoose";
import { randomInt } from "crypto";
import { orderModel } from "../../models/food-order.model";
import { foodModel } from "../../models/food.model";

const MAX_QTY_PER_ITEM = 99;
const PHONE_RE = /^[0-9]{8}$/;

const str = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);

// Short, readable reference customers use for bank transfer, e.g. "HG-482913".
const newOrderNumber = () => `HG-${randomInt(100000, 1000000)}`;

const publicOrder = (o: any) => ({
  _id: o._id,
  orderNumber: o.orderNumber,
  totalPrice: o.totalPrice,
  status: o.status,
  createdAt: o.createdAt,
  customerName: o.customerName,
  phone: o.phone,
  district: o.district,
  shippingAddress: o.shippingAddress,
  foodOrderItems: o.foodOrderItems,
});

// Guests and logged-in users can order. The client only sends WHAT it wants and who it is;
// prices and totals are computed here.
export const createOrderController = async (req, res) => {
  const body = req.body ?? {};
  const items = body.items ?? body.foodOrderItems;
  const customerName = str(body.customer?.name, 80);
  const phone = str(body.customer?.phone, 20).replace(/\s|-/g, "");
  const district = str(body.customer?.district, 60);
  const address = str(body.customer?.address, 500);
  const note = str(body.customer?.note, 500);
  const idempotencyKey = str(body.idempotencyKey, 100);

  if (!Array.isArray(items) || items.length === 0 || items.length > 50) {
    return res.status(400).json({ message: "Order must contain items" });
  }
  if (customerName.length < 2) return res.status(400).json({ message: "Name is required" });
  if (!PHONE_RE.test(phone)) return res.status(400).json({ message: "Phone must be 8 digits" });
  if (address.length < 5) return res.status(400).json({ message: "Address is required" });
  if (idempotencyKey && idempotencyKey.length < 8) {
    return res.status(400).json({ message: "Invalid idempotency key" });
  }

  // Merge duplicates (same product + variant) and validate shape.
  const lines = new Map<string, { food: string; variant: string; quantity: number }>();
  for (const item of items) {
    const food = String(item?.food ?? item?.product ?? "");
    const variant = str(item?.variant, 60);
    const quantity = Number(item?.quantity);
    if (!isValidObjectId(food) || !Number.isInteger(quantity) || quantity < 1) {
      return res.status(400).json({ message: "Invalid order item" });
    }
    const key = `${food}::${variant}`;
    const line = lines.get(key) ?? { food, variant, quantity: 0 };
    line.quantity += quantity;
    if (line.quantity > MAX_QTY_PER_ITEM) {
      return res.status(400).json({ message: "Quantity too large" });
    }
    lines.set(key, line);
  }

  try {
    // Same idempotency key → same order (double tap, retry after a timeout, …).
    if (idempotencyKey) {
      const existing = await orderModel.findOne({ idempotencyKey });
      if (existing) return res.status(200).json({ order: publicOrder(existing), duplicate: true });
    }

    const ids = [...new Set([...lines.values()].map((l) => l.food))];
    const products = await foodModel.find({ _id: { $in: ids } }).select("price variants");
    const byId = new Map(products.map((p) => [String(p._id), p]));
    const missing = ids.filter((id) => !byId.has(id));
    if (missing.length) {
      return res.status(409).json({ message: "Some products no longer exist", missing });
    }

    const orderItems = [];
    for (const line of lines.values()) {
      const product = byId.get(line.food)!;
      const variants: string[] = product.variants ?? [];
      if (variants.length && !variants.includes(line.variant)) {
        return res.status(400).json({ message: "Please choose a variant", product: line.food });
      }
      orderItems.push({
        food: line.food,
        variant: variants.length ? line.variant : "",
        quantity: line.quantity,
        price: product.price,
      });
    }
    const totalPrice = orderItems.reduce((sum, i) => sum + i.price * i.quantity, 0);

    const now = new Date();
    const doc = {
      user: req.userId || undefined,
      idempotencyKey: idempotencyKey || undefined,
      customerName,
      phone,
      district,
      shippingAddress: district ? `${district}, ${address}` : address,
      note,
      paymentMethod: "bank_transfer",
      totalPrice,
      foodOrderItems: orderItems,
      status: "Pending",
      createdAt: now,
      updatedAt: now,
    };

    // Retry on the (rare) order-number collision.
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const order = await orderModel.create({ ...doc, orderNumber: newOrderNumber() });
        return res.status(201).json({ order: publicOrder(order) });
      } catch (error: any) {
        if (error?.code !== 11000) throw error;
        if (error?.keyPattern?.idempotencyKey) {
          const existing = await orderModel.findOne({ idempotencyKey });
          if (existing) return res.status(200).json({ order: publicOrder(existing), duplicate: true });
        }
      }
    }
    throw new Error("Could not allocate order number");
  } catch (error) {
    console.error("Create order failed:", error);
    res.status(500).json({ message: "Server error" });
  }
};
