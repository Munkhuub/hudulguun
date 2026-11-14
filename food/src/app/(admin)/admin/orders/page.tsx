"use client";
import { ChevronsUpDown } from "lucide-react";
import { DatePickerWithRange } from "../_components/DatePicker";
import { Button } from "@/components/ui/button";
import AddressToggler from "./_components/AddressToggler";
import { PaginationAdmin } from "../_components/PaginationAdmin";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth, User } from "@/app/_providers/AuthProvider";
import { formatDate, isAfter, isBefore, isEqual, parseISO } from "date-fns";
import OrderStatusSelect from "./_components/OrderStatusSelect";
import { DateRange } from "react-day-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import OrderedFoodView from "./_components/OrderedFoodView";
import { api } from "@/axios";
import { toast } from "sonner";

export type ordersType = {
  user: User | null;
  _id: string;
  totalPrice: number;
  status: string;
  createdAt: string;
  foodOrderItems: Array<{
    food: { foodName: string; image: string; _id: string } | null;
    quantity: number;
  }>;
  shippingAddress: string;
};
export default function Home() {
  const [orders, setOrders] = useState<ordersType[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<ordersType[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const { user } = useAuth();
  const getAllOrders = useCallback(async () => {
    try {
      const { data } = await api.get(`/orders/all`);
      setOrders(data.order ?? []);
      setFilteredOrders(data.order ?? []);
    } catch (error) {
      console.error("Failed to load orders:", error);
      toast.error("Захиалга ачааллаж чадсангүй");
    }
  }, []);

  useEffect(() => {
    getAllOrders();
  }, [getAllOrders]);

  useEffect(() => {
    if (!dateRange || !dateRange.from) {
      setFilteredOrders(orders);
      return;
    }

    
    const filtered = orders.filter((order) => {
      const orderDate = parseISO(order.createdAt);

      
      if (dateRange.from && !dateRange.to) {
        return (
          isEqual(orderDate, dateRange.from) ||
          isAfter(orderDate, dateRange.from)
        );
      }

     
      if (dateRange.from && dateRange.to) {
        return (
          (isEqual(orderDate, dateRange.from) ||
            isAfter(orderDate, dateRange.from)) &&
          (isEqual(orderDate, dateRange.to) ||
            isBefore(orderDate, dateRange.to))
        );
      }

      return true;
    });

    setFilteredOrders(filtered);
  }, [dateRange, orders]);

  
  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range);
  };

  
  const resetFilters = () => {
    setDateRange(undefined);
    setFilteredOrders(orders);
  };
 
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

 
  const currentOrders = useMemo(() => {
    return filteredOrders.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredOrders, indexOfFirstItem, indexOfLastItem]);

 
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };


  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value));
    setCurrentPage(1); 
  };

  if (!user) {
    return null;
  }
  if (user.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen w-full bg-[#E4E4E7] flex flex-col gap-6 pt-6 pb-13 pl-6 pr-10">
      <div className="size-9 bg-black ml-auto rounded-full">
        <img src={user.image} alt={user.name ?? "Profile"} />
      </div>
      <div className="bg-white h-[800px] rounded-lg px-4">
        <div className="flex justify-between py-4">
          <div>
            <p className="text-xl font-bold">Захиалга</p>
            <p className="text-xs text-[#71717A]">
              {filteredOrders.length} захиалга
            </p>
          </div>
          <div className="flex gap-3">
            <Select
              value={String(itemsPerPage)}
              onValueChange={handleItemsPerPageChange}
            >
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Хуудсанд" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 / хуудас</SelectItem>
                <SelectItem value="10">10 / хуудас</SelectItem>
                <SelectItem value="20">20 / хуудас</SelectItem>
                <SelectItem value="50">50 / хуудас</SelectItem>
              </SelectContent>
            </Select>
            <DatePickerWithRange onDateRangeChange={handleDateRangeChange} />
            {dateRange && (
              <Button onClick={resetFilters} variant="outline">
                Шүүлтүүр арилгах
              </Button>
            )}
          </div>
        </div>
        <div className="overflow-auto max-h-[70vh]">
          <table className="text-[#71717A] w-full text-left">
            <thead className="w-full h-13 border-y-[1px] border-[#F4F4F5CC] ">
              <tr>
                <th className="w-14 text-black font-medium p-4">№</th>
                <th className="w-[213.5px] font-medium p-4">Захиалагч</th>
                <th className="w-40 font-medium p-4">
                  <p>Бүтээгдэхүүн</p>
                </th>
                <th className="h-full w-40 font-medium flex items-cente justify-between pl-4 pr-5 py-4">
                  <p>Огноо</p>
                  <div className="flex items-center">
                    <ChevronsUpDown className="size-4" />
                  </div>
                </th>
                <td className="w-40 font-medium p-4">Нийт</td>
                <td className="w-[213.5px] p-4">Хүргэлтийн хаяг</td>
                <th className="h-full w-40 font-medium flex items-cente justify-between pl-4 pr-5 py-4">
                  <p>Төлөв</p>
                  <div className="flex items-center">
                    <ChevronsUpDown className="size-4" />
                  </div>
                </th>
              </tr>
            </thead>

            <tbody className="w-full h-13 border-b-[1px] border-[#F4F4F5CC]">
              {currentOrders.map((order, index) => (
                <tr key={order._id}>
                  <th className="w-14 font-medium p-4">{indexOfFirstItem + index + 1}</th>
                  <th className="w-[213.5px] font-medium p-4">
                    {order.user?.email ?? "Устгагдсан хэрэглэгч"}
                  </th>
                  <th className="w-40 font-medium p-4">
                    <OrderedFoodView order={order} />
                  </th>
                  <th className="w-40 font-medium p-4">
                    <p>
                      {formatDate(new Date(order.createdAt), "yyyy / MM / dd")}
                    </p>
                  </th>
                  <td className="w-40 font-medium p-4">{order.totalPrice.toLocaleString("en-US")}₮</td>
                  <td className="w-[213.5px] text-xs p-4">
                    <AddressToggler
                      address={order.shippingAddress || order.user?.address}
                      maxLength={57}
                    />
                  </td>
                  <td className="w-40 p-4">
                    <OrderStatusSelect order={order} />
                  </td>
                </tr>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500">
                    Сонгосон хугацаанд захиалга олдсонгүй
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="h-16 ml-auto">
        <PaginationAdmin
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}