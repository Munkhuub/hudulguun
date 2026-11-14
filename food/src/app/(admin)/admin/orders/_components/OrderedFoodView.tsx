import React from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ordersType } from "../page";
import { ChevronDown } from "lucide-react";

type OrderedProps = {
  order: ordersType;
};

const OrderedFoodView = ({ order }: OrderedProps) => {
  // Handle cases where order or foodOrderItems might be missing or empty
  if (!order || !order.foodOrderItems || order.foodOrderItems.length === 0) {
    return (
      <Select>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Бүтээгдэхүүн алга" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="no-items" disabled>
            Бүтээгдэхүүн алга
          </SelectItem>
        </SelectContent>
      </Select>
    );
  }
  const itemCount = order.foodOrderItems.length;
  const itemText = "бүтээгдэхүүн";
  const placeholderText = `${itemCount} ${itemText}`;
  return (
    <Select>
      <SelectTrigger className="w-[160px] border-none shadow-none">
        <SelectValue placeholder={placeholderText} />
        <ChevronDown />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {order.foodOrderItems.map((item, i) => (
            <SelectItem key={item.food?._id ?? i} value={item.food?._id ?? `deleted-${i}`}>
              <div className="flex gap-[10px] items-center">
                {item.food?.image && (
                  <img
                    src={item.food.image}
                    alt={item.food.foodName}
                    className="size-[32px] rounded-sm object-cover"
                  />
                )}
                <p className="flex-grow w-[171px]">
                  {item.food?.foodName ?? "Устгагдсан бүтээгдэхүүн"}
                  {item.variant ? <span className="block text-xs text-[#71717A]">{item.variant}</span> : null}
                </p>
                <p>x{item.quantity}</p>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default OrderedFoodView;
