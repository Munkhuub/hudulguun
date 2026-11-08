import { Schema, model } from "mongoose";

const OrderItemSchema = new Schema({
  food: {
    type: Schema.Types.ObjectId,
    ref: "food",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});
const orderSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "user",
  },
  totalPrice: {
    type: Number,
    required: true,
  },
  foodOrderItems: {
    type: [OrderItemSchema],
    default: [],
    required: true,
  },
  status: {
    type: String,
    enum: ["Pending", "Canceled", "Delivered"],
    default: "Pending",
    required: false,
  },
  createdAt: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    required: true,
  },
});

export const orderModel = model("order", orderSchema);
