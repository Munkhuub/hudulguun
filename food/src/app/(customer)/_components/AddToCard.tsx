import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { FoodsType } from "./Foods";
import { MAX_QTY, useCart } from "./CartContext";
import { ProductImage } from "@/components/ProductImage";

type AddToCardProps = {
  food: FoodsType;
};

const fmt = (n: number) => `${n.toLocaleString("en-US")}₮`;

export const AddToCard = ({ food }: AddToCardProps) => {
  const variants = food.variants ?? [];
  const [quantity, setQuantity] = useState(1);
  const [variant, setVariant] = useState(variants[0] ?? "");
  const [open, setOpen] = useState(false);
  const { addToCart } = useCart();

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) {
      setQuantity(1);
      setVariant(variants[0] ?? "");
    }
  };

  const canAdd = !variants.length || variants.includes(variant);

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="mt-2 h-12 w-full rounded-full bg-[#1A1A1A] text-base font-semibold text-white hover:bg-black">
          <Plus className="size-4" />
          Сагсанд нэмэх
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[92vh] w-[calc(100%-2rem)] overflow-y-auto rounded-3xl p-4 sm:max-w-2xl sm:p-6">
        <div className="flex flex-col gap-5 md:flex-row md:gap-6">
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#F4F2EF] md:w-1/2">
            <ProductImage src={food.image} alt={food.foodName} fill sizes="(min-width: 768px) 320px, 90vw" className="object-cover" />
          </div>

          <div className="flex flex-col gap-5 md:w-1/2">
            <div>
              <DialogTitle className="font-display pr-10 text-xl font-bold sm:text-2xl">{food.foodName}</DialogTitle>
              <DialogDescription className="mt-2 line-clamp-4 text-sm whitespace-pre-line text-[#1A1A1A]/60">
                {food.ingredients}
              </DialogDescription>
              <p className="font-display mt-3 text-xl font-bold">{fmt(food.price)}</p>
            </div>

            {variants.length > 0 && (
              <fieldset>
                <legend className="mb-2 text-sm font-bold">Өнгө сонгох</legend>
                <div className="flex flex-wrap gap-2">
                  {variants.map((v) => (
                    <button
                      key={v}
                      type="button"
                      role="radio"
                      aria-checked={variant === v}
                      onClick={() => setVariant(v)}
                      className={`h-11 rounded-full px-4 text-sm font-semibold transition ${
                        variant === v ? "bg-[#1A1A1A] text-white" : "bg-[#F4F2EF] hover:bg-[#1A1A1A]/10"
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}

            <div className="flex items-center justify-between rounded-2xl bg-[#F4F2EF] p-3">
              <span className="text-sm font-bold">Тоо ширхэг</span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-full bg-white disabled:opacity-40"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Тоо хасах"
                >
                  <Minus className="size-4" />
                </button>
                <span className="min-w-8 text-center font-bold">{quantity}</span>
                <button
                  type="button"
                  className="flex size-10 items-center justify-center rounded-full bg-white disabled:opacity-40"
                  onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
                  disabled={quantity >= MAX_QTY}
                  aria-label="Тоо нэмэх"
                >
                  <Plus className="size-4" />
                </button>
              </div>
            </div>

            <Button
              type="button"
              disabled={!canAdd}
              className="h-12 w-full rounded-full bg-[#1A1A1A] text-base font-semibold text-white hover:bg-black"
              onClick={() => {
                addToCart(food, quantity, variant);
                handleOpenChange(false);
              }}
            >
              Сагсанд нэмэх · {fmt(food.price * quantity)}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
