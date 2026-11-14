"use client";
import React, { createContext, useCallback, useContext, useEffect, useState, ReactNode } from "react";
import { toast } from "sonner";
import { FoodsType } from "./Foods";

export interface CartItem {
  /** Unique line key: product id + variant. */
  key: string;
  /** Product id. */
  id: string;
  variant: string;
  foodName: string;
  price: number;
  quantity: number;
  image: string;
  ingredients: string;
}

interface CartContextType {
  cartItems: CartItem[];
  hydrated: boolean;
  addToCart: (food: FoodsType, quantity: number, variant?: string) => void;
  removeItem: (key: string) => void;
  removeProducts: (productIds: string[]) => void;
  updateQuantity: (key: string, newQuantity: number) => void;
  calculateTotal: () => string;
  clearCart: () => void;
}

// Must match MAX_QTY_PER_ITEM in food-api createOrderController.
export const MAX_QTY = 99;
const STORAGE_KEY = "foodCart";

const lineKey = (id: string, variant: string) => (variant ? `${id}::${variant}` : id);

// Accepts current and older stored shapes; drops anything malformed.
const sanitize = (raw: unknown): CartItem[] => {
  if (!Array.isArray(raw)) return [];
  const out: CartItem[] = [];
  for (const i of raw) {
    if (!i || typeof i !== "object") continue;
    const id = String((i as CartItem).id ?? "");
    const variant = String((i as CartItem).variant ?? "");
    const quantity = Number((i as CartItem).quantity);
    const price = Number((i as CartItem).price);
    if (!/^[a-f0-9]{24}$/i.test(id) || !Number.isInteger(quantity) || quantity < 1 || !Number.isFinite(price)) continue;
    out.push({
      key: lineKey(id, variant),
      id,
      variant,
      quantity: Math.min(quantity, MAX_QTY),
      price,
      foodName: String((i as CartItem).foodName ?? ""),
      image: String((i as CartItem).image ?? ""),
      ingredients: String((i as CartItem).ingredients ?? ""),
    });
  }
  return out;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  // Don't write to storage until we've read it, or the empty initial state wipes the cart.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      setCartItems(sanitize(saved ? JSON.parse(saved) : []));
    } catch {
      // Corrupted or blocked storage: start with an empty cart.
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // Storage full or blocked (private mode): cart still works for this visit.
    }
  }, [cartItems, hydrated]);

  const addToCart = (food: FoodsType, quantity: number, variant = "") => {
    const key = lineKey(food._id, variant);
    setCartItems((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, quantity: Math.min(i.quantity + quantity, MAX_QTY) } : i
        );
      }
      return [
        ...prev,
        {
          key,
          id: food._id,
          variant,
          foodName: food.foodName,
          price: food.price,
          quantity: Math.min(quantity, MAX_QTY),
          image: food.image,
          ingredients: food.ingredients,
        },
      ];
    });
    toast.success(`${food.foodName}${variant ? ` · ${variant}` : ""} (${quantity} ш) сагсанд нэмэгдлээ`);
  };

  const removeItem = (key: string) => {
    const removed = cartItems.find((i) => i.key === key);
    setCartItems((prev) => prev.filter((i) => i.key !== key));
    if (removed) toast(`${removed.foodName} сагснаас хасагдлаа`);
  };

  const removeProducts = useCallback((productIds: string[]) => {
    const ids = new Set(productIds);
    setCartItems((prev) => prev.filter((i) => !ids.has(i.id)));
  }, []);

  const updateQuantity = (key: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(key);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i.key === key ? { ...i, quantity: Math.min(newQuantity, MAX_QTY) } : i))
    );
  };

  const calculateTotal = () =>
    String(cartItems.reduce((total, i) => total + i.price * i.quantity, 0));

  const clearCart = useCallback(() => setCartItems([]), []);

  return (
    <CartContext.Provider
      value={{ cartItems, hydrated, addToCart, removeItem, removeProducts, updateQuantity, calculateTotal, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
