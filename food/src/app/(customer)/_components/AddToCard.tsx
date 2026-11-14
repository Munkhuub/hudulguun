import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { FoodsType } from "./Foods";
import { useCart } from "./CartContext";

type AddToCardProps = {
  food: FoodsType;
};

export const AddToCard = ({ food }: AddToCardProps) => {
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);
  const { addToCart } = useCart();

  const minusFood = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const plusFood = () => {
    setQuantity((prev) => Math.min(prev + 1, 99));
  };

  // Reset quantity when dialog closes
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setQuantity(1);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          className="mt-2 h-12 w-full rounded-full bg-[#1A1A1A] text-base font-semibold text-white hover:bg-black"
          size="default"
        >
          <Plus className="size-4 mr-2" />
          Сагсанд нэмэх
        </Button>
      </DialogTrigger>

      <DialogContent className="w-[95%] sm:max-w-md md:max-w-2xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex flex-col md:flex-row gap-4 md:gap-6">
          {/* Image Section */}
          <div className="relative w-full md:w-1/2 aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-[#F4F2EF]">
            <img
              src={food?.image}
              alt={food?.foodName}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Content Section */}
          <div className="flex flex-col justify-between gap-4 md:gap-6 md:w-1/2">
            {/* Header */}
            <div className="flex flex-col gap-2 md:gap-3">
              <DialogTitle className="font-display text-xl sm:text-2xl md:text-3xl font-bold text-[#1A1A1A]">
                {food?.foodName}
              </DialogTitle>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {food?.ingredients}
              </p>
              <p className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900">
                {food?.price.toLocaleString("en-US")}₮{" "}
                <span className="text-sm text-gray-500 font-normal">/ ширхэг</span>
              </p>
            </div>

            {/* Controls Section */}
            <div className="flex flex-col gap-4 sm:gap-6">
              {/* Quantity Controls */}
              <div className="flex justify-between items-center p-4 bg-[#F4F2EF] rounded-2xl">
                <div>
                  <p className="text-sm text-gray-600">Тоо ширхэг</p>
                  <p className="text-lg font-medium">
                    {quantity} ширхэг
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3 items-center">
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full size-9 sm:size-10"
                    onClick={minusFood}
                    disabled={quantity <= 1}
                  >
                    <Minus className="size-4" />
                  </Button>
                  <span className="text-lg font-semibold min-w-[30px] text-center">
                    {quantity}
                  </span>
                  <Button
                    size="icon"
                    variant="outline"
                    className="rounded-full size-9 sm:size-10"
                    onClick={plusFood}
                  >
                    <Plus className="size-4" />
                  </Button>
                </div>
              </div>

              {/* Total Price */}
              <div className="p-4 bg-[#F4F2EF] rounded-2xl">
                <p className="text-sm text-[#1A1A1A]/60 font-medium">Нийт үнэ</p>
                <p className="font-display text-2xl sm:text-3xl font-bold text-[#1A1A1A]">
                  {(food?.price * quantity).toLocaleString("en-US")}₮
                </p>
              </div>

              {/* Action Button */}
              <DialogFooter className="mt-2">
                <Button
                  type="submit"
                  className="w-full rounded-full h-12 bg-[#1A1A1A] hover:bg-black text-white font-semibold text-base"
                  onClick={() => {
                    addToCart(food, quantity);
                    setOpen(false);
                  }}
                >
                  Сагсанд нэмэх ({quantity} ш)
                </Button>
              </DialogFooter>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
