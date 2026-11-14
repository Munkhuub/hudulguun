import React, { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChevronRightIcon, MapPin } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/app/_providers/AuthProvider";
import { toast } from "sonner";
import { api } from "@/axios";

const DeliveryAddress = ({}) => {
  const [userAddress, setUserAddress] = useState("");
  const { user, setUser } = useAuth();
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [open, setOpen] = useState(false);

  const handleAddressChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserAddress(e.target.value);
    setError("");
  };

  const updateAddress = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userAddress.trim()) {
      setError("Хаягаа оруулна уу");
      return;
    }

    const userId = user?._id;
    if (!userId) {
      setError("Нэвтэрсэн хэрэглэгч олдсонгүй.");
      toast.error("Хэрэглэгч олдсонгүй. Дахин нэвтэрнэ үү.");
      return;
    }
    setIsSubmitting(true);
    try {
      const userId = user?._id;

      const { data } = await api.put(`/user/${userId}`, {
        address: userAddress,
      });
      setUser((prev) => {
        if (!prev) return prev;
        return { ...prev, address: userAddress };
      });
      console.log("Address updated successfully", data);
      toast.success("Хаяг хадгалагдлаа");
      setOpen(false);
    } catch (error) {
      console.error("Failed to update address", error);
      setError("Хаяг хадгалж чадсангүй. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const clearAddress = async () => {
    const userId = user?._id;
    if (!userId) {
      toast.error("Хэрэглэгч олдсонгүй. Дахин нэвтэрнэ үү.");
      return;
    }

    setIsSubmitting(true);
    try {
      await api.put(`/user/${userId}`, {
        address: "",
      });
      setUser((prev) => {
        if (!prev) return prev;
        return { ...prev, address: "" };
      });
      setUserAddress("");
      toast.success("Хаяг устгагдлаа");
      setOpen(false);
    } catch (error) {
      console.error("Failed to clear address", error);
      toast.error("Хаяг устгаж чадсангүй. Дахин оролдоно уу.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) {
          const current = user?.address;
          setUserAddress(current && current !== "address not added" ? current : "");
          setError("");
        }
        setOpen(next);
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="flex min-h-11 w-full items-center gap-2 rounded-xl bg-[#F4F2EF] px-3 py-2 text-left text-sm hover:bg-[#1A1A1A]/5"
        >
          <MapPin className="size-4 shrink-0 text-[#1A1A1A]/60" />
          <span className={`flex-1 truncate ${user?.address && user.address !== "address not added" ? "" : "font-semibold text-[#7B5CF5]"}`}>
            {user?.address && user.address !== "address not added" ? user.address : "Хаяг нэмэх"}
          </span>
          <ChevronRightIcon className="size-4 shrink-0 text-[#1A1A1A]/40" />
        </button>
      </DialogTrigger>
      <DialogContent className="p-6 ">
        <DialogHeader className=" h-9 justify-center">
          <DialogTitle>Хүргэлтийн хаяг</DialogTitle>
        </DialogHeader>
        <form onSubmit={updateAddress} className="flex flex-col gap-6">
          <div>
            <Textarea
              className="w-max-[432px] h-[112px]"
              placeholder="Дүүрэг, хороо, байр, орц, тоот зэрэг дэлгэрэнгүй хаягаа бичнэ үү"
              value={userAddress}
              onChange={handleAddressChange}
            />
            {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
          </div>
          <DialogFooter>
            <Button
              type="button"
              onClick={clearAddress}
              disabled={isSubmitting}
              className="bg-white text-black border border-[#E4E4E7]"
            >
              Хаяг устгах
            </Button>
            <DialogClose asChild>
              <Button
                type="button"
                className="bg-white text-black border border-[#E4E4E7]"
              >
                Болих
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Хадгалж байна..." : "Хадгалах"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DeliveryAddress;
