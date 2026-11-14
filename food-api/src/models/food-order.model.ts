import { Schema, model } from "mongoose";

export const ORDER_STATUSES = ["Pending", "Paid", "Shipped", "Delivered", "Canceled"] as const;

const OrderItemSchema = new Schema(
  {
    food: { type: Schema.Types.ObjectId, ref: "food", required: true },
    quantity: { type: Number, required: true, min: 1 },
    variant: { type: String, default: "" },
    // Unit price at the time of ordering (server-computed), so later price changes
    // don't rewrite history.
    price: { type: Number },
  },
  { _id: false }
);

const orderSchema = new Schema({
  // Optional: guests can order without an account.
  user: { type: Schema.Types.ObjectId, ref: "user", required: false },
  orderNumber: { type: String },
  idempotencyKey: { type: String },
  customerName: { type: String, default: "" },
  phone: { type: String, default: "" },
  district: { type: String, default: "" },
  shippingAddress: { type: String, required: false },
  note: { type: String, default: "" },
  paymentMethod: { type: String, default: "bank_transfer" },
  totalPrice: { type: Number, required: true },
  foodOrderItems: { type: [OrderItemSchema], default: [], required: true },
  status: { type: String, enum: ORDER_STATUSES, default: "Pending" },
  createdAt: { type: Date, required: true },
  updatedAt: { type: Date, required: true },
});

orderSchema.index({ createdAt: -1 });
orderSchema.index({ phone: 1 });
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 }, { unique: true, sparse: true });
orderSchema.index({ idempotencyKey: 1 }, { unique: true, sparse: true });

export const orderModel = model("order", orderSchema);
