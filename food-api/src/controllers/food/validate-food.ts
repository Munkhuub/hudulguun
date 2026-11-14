import { isValidObjectId } from "mongoose";

export type FoodInput = {
  foodName: string;
  price: number;
  image: string;
  ingredients: string;
  category: string;
};

// Returns the cleaned product fields, or an error message for a 400 response.
export const validateFood = (body: any): { data: FoodInput } | { error: string } => {
  const foodName = String(body?.foodName ?? "").trim();
  const ingredients = String(body?.ingredients ?? "").trim();
  const image = String(body?.image ?? "").trim();
  const category = String(body?.category ?? "");
  const price = Number(body?.price);

  if (!foodName) return { error: "Name is required" };
  if (!Number.isInteger(price) || price <= 0) return { error: "Price must be a positive whole number" };
  if (!/^https?:\/\//.test(image)) return { error: "Image URL is required" };
  if (!isValidObjectId(category)) return { error: "Invalid category" };

  return { data: { foodName, price, image, ingredients, category } };
};
