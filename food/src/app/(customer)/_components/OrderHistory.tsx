import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import OrderFoodIcon from "./_assets/OrderFoodIcon";
import OrderDateIcon from "./_assets/OrderDateIcon";
import { formatDate } from "date-fns";
import OrderMapIcon from "./_assets/OrderMapIcon";

type OrderHistoryItem = {
  _id: string;
  orderNumber: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  foodOrderItems: Array<{ food: { foodName: string }; quantity: number }>;
  shippingAddress: string;
};

type OrderHistoryProps = {
  orderHistory: OrderHistoryItem[];
  isLoadingOrders: boolean;
};
const OrderHistory = ({ orderHistory, isLoadingOrders }: OrderHistoryProps) => {
  return (
    <TabsContent value="history">
      <Card>
        <CardHeader>
          <CardTitle>Захиалгын түүх</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 ">
          <div className="max-h-160 overflow-auto scroll-auto">
            {isLoadingOrders ? (
              <div className="text-center text-gray-500">
                Ачааллаж байна...
              </div>
            ) : orderHistory.length > 0 ? (
              orderHistory.map((order) => (
                <div key={order._id} className="space-y-4 ">
                  <div className="flex flex-col gap-3 border-b pb-4 border-gray-200 last:border-b-0">
                    <div className="flex justify-between items-center">
                      <div className="flex gap-2">
                        <span className="font-bold">
                          {order.totalPrice.toLocaleString("en-US")}₮
                        </span>
                        <span className="text-gray-600">
                          (#{order.orderNumber})
                        </span>
                      </div>
                      <Button
                        className={`bg-white border text-xs rounded-full w-[68px] h-[28px] ${
                          order.status === "Pending"
                            ? "border-[#EF4444] text-[#EF4444]"
                            : "border-green-500 text-green-500"
                        }`}
                      >
                        {({ Pending: "Хүлээгдэж буй", Delivered: "Хүргэгдсэн", Canceled: "Цуцлагдсан" } as Record<string, string>)[order.status] ?? order.status}
                      </Button>
                    </div>
                    {order.foodOrderItems.map((item, itemIndex) => (
                      <div key={itemIndex} className="flex justify-between">
                        <div className="flex gap-2 items-center">
                          <OrderFoodIcon />
                          <p>{item.food.foodName}</p>
                        </div>
                        <div>x{item.quantity}</div>
                      </div>
                    ))}
                    <div className="flex justify-between">
                      <div className="flex gap-2 items-center">
                        <OrderDateIcon />
                        <p>
                          {formatDate(
                            new Date(order.createdAt),
                            "yyyy-MM-dd HH:mm"
                          )}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex gap-2 items-center">
                        <OrderMapIcon />
                        <p className="max-w-[70%] truncate">
                          {order.shippingAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500">
                Танд одоогоор захиалга алга.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default OrderHistory;
