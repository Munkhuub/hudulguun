import { ProductImage } from "@/components/ProductImage";
import { AddToCard } from "./AddToCard";
import { FoodsType } from "./Foods";

type FoodCardProps = {
  food: FoodsType;
};

export const FoodCard = ({ food }: FoodCardProps) => {
  return (
    <article className="group flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-12px_rgba(26,26,26,0.18)] transition-shadow hover:shadow-[0_16px_40px_-12px_rgba(26,26,26,0.28)]">
      <div className="relative aspect-square w-full overflow-hidden bg-[#F4F2EF]">
        <ProductImage
          src={food.image}
          alt={food.foodName}
          fill
          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
        <h3 className="text-lg leading-snug font-bold">{food.foodName}</h3>
        <p className="line-clamp-2 text-sm text-[#1A1A1A]/60">{food.ingredients}</p>
        <p className="font-display mt-auto pt-2 text-xl font-bold">
          {food.price.toLocaleString("en-US")}₮
        </p>
        <AddToCard food={food} />
      </div>
    </article>
  );
};
