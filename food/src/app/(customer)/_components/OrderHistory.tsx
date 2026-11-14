import { TabsContent } from "@/components/ui/tabs";
import React from "react";
import { formatDate } from "date-fns";
import OrderFoodIcon from "./_assets/OrderFoodIcon";
import OrderDateIcon from "./_assets/OrderDateIcon";
import OrderMapIcon from "./_assets/OrderMapIcon";

export type OrderHistoryItem = {
  _id: string;
  orderNumber?: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  foodOrderItems: Array<{ food: { foodName: string } | null; quantity: number; variant?: string }>;
  shippingAddress: string;
};

export const ORDER_STATUS_LABELS: Record<string, string> = {
  Pending: "Хүлээгдэж буй",
  Paid: "Төлөгдсөн",
  Shipped: "Хүргэлтэнд гарсан",
  Delivered: "Хүргэгдсэн",
  Canceled: "Цуцлагдсан",
};

const STATUS_STYLE: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-800",
  Paid: "bg-blue-100 text-blue-800",
  Shipped: "bg-violet-100 text-violet-800",
  Delivered: "bg-green-100 text-green-800",
  Canceled: "bg-gray-200 text-gray-700",
};

export const orderRef = (o: { orderNumber?: string; _id: string }) =>
  o.orderNumber || `#${o._id.slice(-6).toUpperCase()}`;

type OrderHistoryProps = {
  orderHistory: OrderHistoryItem[];
  isLoadingOrders: boolean;
};

const OrderHistory = ({ orderHistory, isLoadingOrders }: OrderHistoryProps) => {
  return (
    <TabsContent value="history" className="mt-4">
      {isLoadingOrders ? (
        <div className="rounded-2xl bg-white p-8 text-center text-[#1A1A1A]/60">Ачааллаж байна...</div>
      ) : orderHistory.length > 0 ? (
        <ul className="flex flex-col gap-3">
          {orderHistory.map((order) => (
            <li key={order._id} className="flex flex-col gap-3 rounded-2xl bg-white p-4 text-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="font-bold">{order.totalPrice.toLocaleString("en-US")}₮</p>
                  <p className="text-xs text-[#1A1A1A]/50">{orderRef(order)}</p>
                </div>
                <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLE[order.status] ?? STATUS_STYLE.Pending}`}>
                  {ORDER_STATUS_LABELS[order.status] ?? order.status}
                </span>
              </div>
              {order.foodOrderItems.map((item, i) => (
                <div key={i} className="flex justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-2">
                    <OrderFoodIcon />
                    <p className="truncate">
                      {item.food?.foodName ?? "Устгагдсан бүтээгдэхүүн"}
                      {item.variant ? ` · ${item.variant}` : ""}
                    </p>
                  </div>
                  <span>x{item.quantity}</span>
                </div>
              ))}
              <div className="flex items-center gap-2 text-[#1A1A1A]/70">
                <OrderDateIcon />
                {formatDate(new Date(order.createdAt), "yyyy-MM-dd HH:mm")}
              </div>
              {order.shippingAddress && (
                <div className="flex items-center gap-2 text-[#1A1A1A]/70">
                  <OrderMapIcon />
                  <span className="truncate">{order.shippingAddress}</span>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="rounded-2xl bg-white p-8 text-center text-[#1A1A1A]/60">Танд одоогоор захиалга алга.</div>
      )}
    </TabsContent>
  );
};

export default OrderHistory;
