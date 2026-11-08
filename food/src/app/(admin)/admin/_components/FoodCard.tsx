import { Card, CardContent } from "@/components/ui/card";
import { EditFood } from "./EditFood";
import { FoodsTypeCategory } from "./CategoryFoods";

type FoodCardProps = {
  food: FoodsTypeCategory;
  categoryId: string;
  getFoods: () => Promise<void>;
};

export const FoodCard = ({ food, categoryId, getFoods }: FoodCardProps) => {
  return (
    <Card className="w-full max-w-[320px] p-0">
      <CardContent className="p-3 sm:p-4 md:p-5 rounded-[20px] flex flex-col gap-2 sm:gap-3 relative">
        <img
          src={food?.image}
          alt={food?.foodName ?? ""}
          className="h-[100px] sm:h-[127px] md:h-[140px] lg:h-[160px] w-full object-cover rounded-xl"
        />
        <EditFood food={food} categoryId={categoryId} getFoods={getFoods} />
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-start gap-2">
            <h3 className="text-xs sm:text-[14px] md:text-base lg:text-lg text-[#EF4444] font-semibold leading-tight flex-1 min-w-0">
              {food.foodName}
            </h3>
            <p className="text-xs sm:text-sm md:text-base font-semibold whitespace-nowrap flex-shrink-0">
              {food.price.toLocaleString("en-US")}₮
            </p>
          </div>
          <p className="text-xs sm:text-sm md:text-sm leading-relaxed line-clamp-2 text-gray-600">
            {food.ingredients}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};