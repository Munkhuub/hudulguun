import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Minus, Plus, ShoppingCartIcon, X } from "lucide-react";
import { toast } from "sonner";
import { Cart } from "./_assets/Cart";
import { useCart } from "./CartContext";
import { useAuth } from "@/app/_providers/AuthProvider";
import OrderHistory, { OrderHistoryItem } from "./OrderHistory";
import { api } from "@/axios";
import { ProductImage } from "@/components/ProductImage";

const fmt = (n: number) => `${n.toLocaleString("en-US")}₮`;

const CartDetail = () => {
  const { cartItems, removeItem, updateQuantity, calculateTotal } = useCart();
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("cart");
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);

  const total = Number(calculateTotal());
  const itemCount = cartItems.reduce((n, i) => n + i.quantity, 0);

  const fetchOrderHistory = useCallback(async () => {
    if (!user) return;
    setIsLoadingOrders(true);
    try {
      const { data } = await api.get(`/orders`);
      setOrderHistory(data.order ?? []);
    } catch (error) {
      console.error("Error fetching order history:", error);
      toast.error("Захиалгын түүх ачааллаж чадсангүй");
    } finally {
      setIsLoadingOrders(false);
    }
  }, [user]);

  useEffect(() => {
    if (open && activeTab === "history" && user) fetchOrderHistory();
  }, [open, activeTab, user, fetchOrderHistory]);

  useEffect(() => {
    if (!user) setActiveTab("cart");
  }, [user]);

  const cartList =
    cartItems.length > 0 ? (
      <ul className="flex flex-col gap-3">
        {cartItems.map((item) => (
          <li key={item.key} className="flex gap-3 rounded-2xl bg-white p-3">
            <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-[#F4F2EF] sm:size-24">
              <ProductImage src={item.image} alt={item.foodName} fill sizes="96px" className="object-cover" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-between gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="line-clamp-2 text-sm font-bold sm:text-base">{item.foodName}</p>
                  {item.variant && <p className="text-xs text-[#1A1A1A]/60">{item.variant}</p>}
                </div>
                <button
                  className="-m-1 shrink-0 rounded-full p-2 text-[#1A1A1A]/50 hover:bg-[#1A1A1A]/5 hover:text-[#1A1A1A]"
                  onClick={() => removeItem(item.key)}
                  aria-label={`${item.foodName} хасах`}
                >
                  <X className="size-4" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center rounded-full bg-[#F4F2EF]">
                  <button
                    className="flex size-9 items-center justify-center rounded-full hover:bg-[#1A1A1A]/5"
                    onClick={() => updateQuantity(item.key, item.quantity - 1)}
                    aria-label="Тоо хасах"
                  >
                    <Minus className="size-4" />
                  </button>
                  <span className="min-w-6 text-center text-sm font-bold">{item.quantity}</span>
                  <button
                    className="flex size-9 items-center justify-center rounded-full hover:bg-[#1A1A1A]/5"
                    onClick={() => updateQuantity(item.key, item.quantity + 1)}
                    aria-label="Тоо нэмэх"
                  >
                    <Plus className="size-4" />
                  </button>
                </div>
                <p className="text-sm font-bold sm:text-base">{fmt(item.price * item.quantity)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    ) : (
      <div className="rounded-2xl bg-white p-8 text-center text-[#1A1A1A]/60">Таны сагс хоосон байна</div>
    );

  const cartFooter = cartItems.length > 0 && (
    <>
      <div className="flex flex-col gap-2 rounded-2xl bg-white p-4 text-sm">
        <div className="flex justify-between">
          <span className="text-[#1A1A1A]/60">Бүтээгдэхүүн ({itemCount})</span>
          <span className="font-semibold">{fmt(total)}</span>
        </div>
        <div className="mt-1 flex justify-between border-t border-[#1A1A1A]/10 pt-3 text-base">
          <span className="font-bold">Нийт дүн</span>
          <span className="font-display font-bold">{fmt(total)}</span>
        </div>
      </div>
      <SheetFooter className="p-0">
        <Link
          href="/checkout"
          onClick={() => setOpen(false)}
          className="flex h-12 w-full items-center justify-center rounded-full bg-[#1A1A1A] text-base font-semibold text-white hover:bg-black"
        >
          Захиалах
        </Link>
      </SheetFooter>
    </>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="relative size-10 rounded-full border-none bg-white shadow-sm hover:bg-white/70"
          aria-label={`Сагс${itemCount ? ` (${itemCount})` : ""}`}
        >
          <Cart />
          {itemCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#1A1A1A] px-1 text-[11px] font-bold text-white">
              {itemCount > 99 ? "99+" : itemCount}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="flex w-full max-w-full flex-col gap-0 overflow-y-auto border-none bg-[#F4F2EF] p-4 sm:max-w-[480px] sm:rounded-l-3xl sm:p-6">
        <SheetHeader className="p-0">
          <SheetTitle className="font-display flex items-center gap-2 text-lg sm:text-xl">
            <ShoppingCartIcon className="size-5" />
            Сагс
          </SheetTitle>
        </SheetHeader>

        {user ? (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
            <TabsList className="grid h-11 w-full grid-cols-2 rounded-full bg-[#1A1A1A]/5 p-1">
              <TabsTrigger value="cart" className="rounded-full text-sm font-semibold">
                Сагс{itemCount ? ` (${itemCount})` : ""}
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-full text-sm font-semibold">
                Захиалгын түүх
              </TabsTrigger>
            </TabsList>
            <TabsContent value="cart" className="mt-4 flex flex-col gap-4">
              {cartList}
              {cartFooter}
            </TabsContent>
            <OrderHistory orderHistory={orderHistory} isLoadingOrders={isLoadingOrders} />
          </Tabs>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {cartList}
            {cartFooter}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDetail;
