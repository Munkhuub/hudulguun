import { useCallback, useEffect, useState } from "react";
import { FoodCard } from "./FoodCard";
import { AddFood } from "./AddFood";
import { api } from "@/axios";

type CategoryFoodsProps = {
  categoryId: string;
  categoryName: string;
};

export type FoodsTypeCategory = {
  _id: string;
  foodName: string;
  ingredients: string;
  image: string;
  category: { categoryName: string };
  price: number;
};

export const CategoryFoods = ({
  categoryId,
  categoryName,
}: CategoryFoodsProps) => {
  const [foods, setFoods] = useState<FoodsTypeCategory[]>([]);

  const getFoods = useCallback(async () => {
    try {
      const { data } = await api.get(`/food?categoryId=${categoryId}`);
      setFoods(data.food);
    } catch (error) {
      console.error("Error fetching food:", error);
      setFoods([]);
    }
  }, [categoryId]);

  useEffect(() => {
    getFoods();
  }, [getFoods]);

  return (
    <div className="bg-white p-3 sm:p-4 lg:p-5 rounded-xl flex flex-col gap-3 sm:gap-4">
      <h4 className="text-lg sm:text-xl lg:text-2xl font-semibold">
        {categoryName} ({foods.length})
      </h4>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 sm:gap-4 lg:gap-5 justify-items-center">
        <AddFood
          getFoods={getFoods}
          categoryId={categoryId}
          categoryName={categoryName}
        />

        {foods.map((food) => (
          <FoodCard
            key={food._id}
            food={food}
            categoryId={categoryId}
            getFoods={getFoods}
          />
        ))}
      </div>
    </div>
  );
};