"use client";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronsUpDown } from "lucide-react";
import { ordersType } from "../page";
import { toast } from "sonner";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { api } from "@/axios";
type statusProps = {
  order: ordersType;
};

const statusOptions = ["Pending", "Canceled", "Delivered"];
const STATUS_LABELS: Record<string, string> = {
  Pending: "Хүлээгдэж буй",
  Canceled: "Цуцлагдсан",
  Delivered: "Хүргэгдсэн",
};

const OrderStatusSelect = ({ order }: statusProps) => {
  const [newStatus, setNewStatus] = useState(order.status);
  const handleSelectStatus = async (status: string) => {
    const previous = newStatus;
    setNewStatus(status);
    try {
      await api.put(`/orders/${order._id}`, { status });
      toast.success("Төлөв шинэчлэгдлээ");
    } catch (error) {
      console.error("Failed to update status", error);
      setNewStatus(previous); // revert so the UI matches the database
      toast.error("Төлөв шинэчилж чадсангүй");
    }
  };

  const borderColorClass =
    newStatus === "Pending"
      ? "border-red-500"
      : newStatus === "Delivered"
      ? "border-green-500"
      : "";

  return (
    <Select value={newStatus} onValueChange={handleSelectStatus}>
      <SelectTrigger
        className={cn(
          "rounded-full flex gap-2",
          borderColorClass,
          newStatus === "Pending" && "focus:ring-red-500",
          newStatus === "Delivered" && "focus:ring-green-500"
        )}
      >
        <SelectValue placeholder="Хүлээгдэж буй" />
        <div className="flex items-center">
          <ChevronsUpDown className="size-4" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {statusOptions.map((status, index) => (
            <SelectItem key={index} value={status}>
              {STATUS_LABELS[status] ?? status}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default OrderStatusSelect;
