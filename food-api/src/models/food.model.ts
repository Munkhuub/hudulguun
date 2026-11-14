import { Schema, model } from "mongoose";

const foodSchema = new Schema({
  foodName: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  ingredients: {
    type: String,
    required: true,
  },
  // Colour/variant options, e.g. ["Бүдэг өнгө", "Тод өнгө"]. Empty = no choice needed.
  variants: {
    type: [String],
    default: [],
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "category",
    required: true,
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

export const foodModel = model("food", foodSchema);
