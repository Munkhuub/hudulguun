import { Schema, model } from "mongoose";

const categorySchema = new Schema({
  categoryName: {
    type: String,
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

export const categoryModel = model("category", categorySchema);
