import { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: false,
    default: "email not added",
  },
  address: {
    type: String,
    required: false,
    default: "address not added",
  },
  image: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  orders: {
    type: [Schema.Types.ObjectId],
    ref: "category",
    default: [],
  },
  ttl: {
    type: Date,
    required: false,
  },
  isVerified: {
    type: Boolean,
    default: false,
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

export const userModel = model("user", userSchema);
