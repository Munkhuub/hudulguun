import { AddToCard } from "./AddToCard";
import { FoodsType } from "./Foods";

type FoodCardProps = {
  food: FoodsType;
};

export const FoodCard = ({ food }: FoodCardProps) => {
  return (
    <div className="w-full max-w-sm mx-auto h-full p-4 lg:p-5 bg-white rounded-2xl md:rounded-[20px] flex flex-col gap-3 lg:gap-4 relative shadow-md hover:shadow-lg transition-shadow">
      <div className="relative overflow-hidden rounded-xl aspect-square flex-shrink-0">
        <img
          src={food?.image}
          alt={food.foodName}
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
          loading="lazy"
        />
      </div>

      <div className="flex flex-col gap-2 flex-1">
        <div className="flex justify-between items-start gap-2">
          <h3 className="text-base md:text-lg lg:text-xl font-semibold flex-1 leading-tight text-gray-900 line-clamp-2">
            {food.foodName}
          </h3>
          <p className="text-base md:text-lg lg:text-xl font-semibold whitespace-nowrap text-red-500 flex-shrink-0">
            {food.price.toLocaleString("en-US")}₮
          </p>
        </div>
        <div className="flex-1 min-h-[3rem] md:min-h-[3.5rem]">
          <p className="text-sm md:text-base text-gray-600 line-clamp-3">
            {food.ingredients}
          </p>
        </div>
      </div>

      <div className="mt-auto">
        <AddToCard food={food} />
      </div>
    </div>
  );
};
