"use client";
import { useAuth } from "@/app/_providers/AuthProvider";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { toast } from "sonner";
import { FoodsType } from "./Foods";

interface CartItem {
  id: string;
  foodName: string;
  price: number;
  quantity: number;
  image: string;
  ingredients: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (food: FoodsType, quantity: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, newQuantity: number) => void;
  calculateTotal: () => string;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("foodCart");
      const parsed = savedCart ? JSON.parse(savedCart) : [];
      if (Array.isArray(parsed)) setCartItems(parsed);
    } catch {
      // Corrupted or blocked storage: start with an empty cart.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("foodCart", JSON.stringify(cartItems));
    } catch {
      // Storage full or blocked (private mode): cart still works for this visit.
    }
  }, [cartItems]);

  const addToCart = (food: FoodsType, quantity: number) => {
    if (!user) {
      toast.error("Захиалга өгөхийн тулд нэвтэрнэ үү");
      return;
    }
    try {
      const foodId =
        food._id || `food-${food.foodName.replace(/\s+/g, "-").toLowerCase()}`;

      setCartItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (item) => item.id === foodId
        );

        if (existingItemIndex >= 0) {
          const newItems = [...prevItems];
          newItems[existingItemIndex] = {
            ...newItems[existingItemIndex],
            quantity: newItems[existingItemIndex].quantity + quantity,
          };
          return newItems;
        } else {
          return [
            ...prevItems,
            {
              id: foodId,
              foodName: food.foodName,
              price: food.price,
              quantity: quantity,
              image: food.image,
              ingredients: food.ingredients,
            },
          ];
        }
      });

      toast.success(
        `${food.foodName} (${quantity} ш) сагсанд нэмэгдлээ`
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Сагсанд нэмж чадсангүй. Дахин оролдоно уу.");
    }
  };

  const removeItem = (id: string) => {
    const removedItem = cartItems.find((item) => item.id === id);

    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));

    if (removedItem) {
      toast(`${removedItem.foodName} сагснаас хасагдлаа`);
    }
  };

  const updateQuantity = (id: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const calculateTotal = () => {
    return cartItems
      .reduce((total, item) => total + item.price * item.quantity, 0)
      .toFixed(2);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeItem,
        updateQuantity,
        calculateTotal,
        clearCart,
      }}
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
