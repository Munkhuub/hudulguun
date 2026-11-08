import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Cart } from "./_assets/Cart";
import { Minus, Plus, ShoppingCartIcon, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { useCart } from "./CartContext";
import { useAuth } from "@/app/_providers/AuthProvider";
import OrderHistory from "./OrderHistory";
import { api } from "@/axios";

type OrderHistoryItem = {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  foodOrderItems: Array<{ food: { foodName: string }; quantity: number }>;
  shippingAddress: string;
};

const CartDetail = () => {
  const { cartItems, removeItem, updateQuantity, calculateTotal, clearCart } =
    useCart();
  const [open, setOpen] = useState(false);
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("cart");
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  const total = useMemo(() => calculateTotal(), [calculateTotal]);

  const handlePlaceOrder = useCallback(async () => {
    if (!user) {
      toast.error("Захиалга өгөхийн тулд нэвтэрнэ үү");
      return;
    }
    if (!user?.address) {
      toast.error("Хүргэлтийн хаягаа оруулна уу");
      return;
    }
    if (cartItems.length === 0) {
      toast.error("Таны сагс хоосон байна");
      return;
    }

    setIsPlacingOrder(true);
    try {
      await api.post(
        "/orders",
        {
          user: user._id,
          totalPrice: total,
          foodOrderItems: cartItems.map((item) => ({
            food: item.id,
            quantity: item.quantity,
          })),
          status: "Pending",
        },
        {
          headers: {
            Authorization: `${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Захиалга амжилттай илгээгдлээ!");
      clearCart();
      setActiveTab("history");
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Захиалга илгээж чадсангүй. Дахин оролдоно уу.");
    } finally {
      setIsPlacingOrder(false);
    }
  }, [user, cartItems, total, clearCart, setActiveTab]);

  const fetchOrderHistory = useCallback(async () => {
    if (!user) {
      setOrderHistory([]);
      return;
    }

    setIsLoadingOrders(true);
    try {
      const response = await api.get(`/orders`, {
        headers: {
          Authorization: `${localStorage.getItem("token")}`,
        },
      });
      setOrderHistory(response.data.order);
    } catch (error) {
      console.error("Error fetching order history:", error);
      toast.error("Захиалгын түүх ачааллаж чадсангүй");
    } finally {
      setIsLoadingOrders(false);
    }
  }, [user]);

  const handleQuantityUpdate = useCallback(
    (id: string, newQuantity: number) => {
      updateQuantity(id, newQuantity);
    },
    [updateQuantity]
  );

  const handleRemoveItem = useCallback(
    (id: string) => {
      removeItem(id);
    },
    [removeItem]
  );

  useEffect(() => {
    if (open && activeTab === "history" && user) {
      fetchOrderHistory();
    }
  }, [open, activeTab, user, fetchOrderHistory]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Cart />
        </Button>
      </SheetTrigger>
      <SheetContent className="bg-[#404040] w-full max-w-[95vw] sm:max-w-[535px] p-4 sm:p-[32px] border-none rounded-l-[20px] overflow-hidden">
        <SheetHeader className="p-0">
          <div className="flex gap-3 items-center text-white">
            <ShoppingCartIcon className="size-5 sm:size-6" />
            <SheetTitle className="text-white text-lg sm:text-xl">
              Захиалгын дэлгэрэнгүй
            </SheetTitle>
          </div>
        </SheetHeader>
        <Tabs
          defaultValue="cart"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-2 mt-4">
            <TabsTrigger value="cart" className="text-sm">
              Сагс
            </TabsTrigger>
            <TabsTrigger value="history" className="text-sm">
              Захиалгын түүх
            </TabsTrigger>
          </TabsList>
          <TabsContent value="cart" className="mt-4">
            <Card className="p-2 sm:p-4 w-full bg-none">
              <CardContent className="p-0 flex flex-col gap-3 sm:gap-5">
                <CardHeader className="p-0">
                  <CardTitle className="text-lg sm:text-xl">Миний сагс</CardTitle>
                </CardHeader>

                {cartItems.length > 0 ? (
                  <div className="flex flex-col max-h-[50vh] sm:max-h-80 overflow-auto gap-3 sm:gap-5">
                    {cartItems.map((food, index) => (
                      <div
                        className={`flex gap-2 sm:gap-[10px] pt-3 sm:pt-5 ${
                          index !== 0 ? "border-t border-gray-300" : ""
                        }`}
                        key={food.id}
                      >
                        <div className="relative w-20 h-20 sm:w-[124px] sm:h-[120px] rounded-xl overflow-hidden flex-shrink-0">
                          <img
                            src={food.image}
                            alt={food.foodName}
                            sizes="(max-width: 640px) 80px, 124px"
                            className="rounded-xl object-cover"
                          />
                        </div>
                        <div className="flex flex-col justify-between flex-1 gap-3 sm:gap-6 min-w-0">
                          <div className="flex justify-between">
                            <div className="flex-1 min-w-0 pr-2">
                              <SheetTitle className="text-sm sm:text-[16px]/[28px] text-[#EF4444] truncate">
                                {food.foodName}
                              </SheetTitle>
                              <p className="text-xs/4 text-gray-600 line-clamp-2 sm:line-clamp-none">
                                {food.ingredients}
                              </p>
                            </div>
                            <button
                              className="mb-auto mt-[1px] p-1 text-red-500 hover:text-red-700 flex-shrink-0"
                              onClick={() => handleRemoveItem(food.id)}
                            >
                              <X className="h-3 w-3 sm:h-4 sm:w-4" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center w-full">
                            <div className="flex gap-2 sm:gap-3 items-center">
                              <Button
                                size="icon"
                                className="bg-white size-7 sm:size-9 shadow-none"
                                onClick={() =>
                                  handleQuantityUpdate(
                                    food.id,
                                    food.quantity - 1
                                  )
                                }
                              >
                                <Minus className="text-black size-3 sm:size-4" />
                              </Button>
                              <p className="text-sm sm:text-[18px] min-w-[20px] text-center">
                                {food.quantity}
                              </p>
                              <Button
                                size="icon"
                                className="bg-white size-7 sm:size-9 shadow-none"
                                onClick={() =>
                                  handleQuantityUpdate(
                                    food.id,
                                    food.quantity + 1
                                  )
                                }
                              >
                                <Plus className="text-black size-3 sm:size-4" />
                              </Button>
                            </div>
                            <div>
                              <p className="font-semibold text-sm sm:text-base">
                                {(food.price * food.quantity).toLocaleString("en-US")}₮
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-gray-500">
                    Таны сагс хоосон байна
                  </div>
                )}

                <div className="space-y-2 sm:space-y-3">
                  <h3 className="text-lg sm:text-xl font-semibold">
                    Төлбөрийн мэдээлэл
                  </h3>
                  <div className="flex justify-between text-sm sm:text-[16px]">
                    <span className="text-[#71717A]">Бүтээгдэхүүн</span>
                    <span className="font-bold">{Number(total).toLocaleString("en-US")}₮</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-[16px]">
                    <span className="text-[#71717A]">Хүргэлт</span>
                    <span className="font-bold">Үнэгүй</span>
                  </div>
                  <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 text-sm sm:text-[16px]">
                    <div className="flex justify-between">
                      <span className="text-[#71717A]">Нийт дүн:</span>
                      <span className="font-bold">{Number(total).toLocaleString("en-US")}₮</span>
                    </div>
                  </div>
                </div>

                {cartItems.length > 0 && (
                  <SheetFooter className="mt-4">
                    <Button
                      type="submit"
                      className="w-full rounded-full h-10 sm:h-11 bg-black text-sm sm:text-base"
                      onClick={handlePlaceOrder}
                      disabled={isPlacingOrder}
                    >
                      {isPlacingOrder
                        ? "Илгээж байна..."
                        : "Захиалга өгөх"}
                    </Button>
                  </SheetFooter>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          <OrderHistory
            orderHistory={orderHistory}
            isLoadingOrders={isLoadingOrders}
          />
        </Tabs>
      </SheetContent>
    </Sheet>
  );
};

export default CartDetail;
