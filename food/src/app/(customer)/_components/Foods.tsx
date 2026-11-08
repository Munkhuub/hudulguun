import { useEffect, useState } from "react";
import { FoodCard } from "./FoodCard";
import { api } from "@/axios";

export type FoodsType = {
  foodName: string;
  ingredients: string;
  image: string;
  category: { categoryName: string };
  price: number;
  _id: string;
};

type AppetizersType = {
  categoryId: string;
  categoryName: string;
  selectedCategory: string;
};

export const Foods = ({
  categoryId,
  categoryName,
  selectedCategory,
}: AppetizersType) => {
  const [foods, setFoods] = useState<FoodsType[]>([]);
  const [error, setError] = useState(false);

  const getFoods = async () => {
    try {
      setError(false);
      const response = await api.get(`/food?categoryId=${categoryId}`);
      setFoods(response.data.food || []);
    } catch (error) {
      console.error("Error fetching foods:", error);
      setError(true);
      setFoods([]);
    }
  };

  useEffect(() => {
    getFoods();
  }, [categoryId]);

  if (!foods.length && !selectedCategory) return null;

  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 bg-[#404040] pb-8 sm:pb-12 md:pb-[54px] flex flex-col gap-5">
      <div>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white mb-6 sm:mb-8 md:mb-[54px]">
          {categoryName}
        </h2>
      </div>
      <div>
        {error ? (
          <div className="text-white text-center py-10 sm:py-16 border border-gray-700 rounded-lg bg-[#353535]">
            <p className="text-red-400 mb-2">Бүтээгдэхүүн ачааллаж чадсангүй</p>
            <button
              onClick={getFoods}
              className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-md transition-colors"
            >
              Дахин оролдох
            </button>
          </div>
        ) : foods.length > 0 ? (
          <>
            <div className="md:hidden">
              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide snap-x snap-mandatory">
                {foods.map((food) => (
                  <div
                    key={food._id}
                    className="flex-shrink-0 w-[280px] snap-start"
                  >
                    <FoodCard food={food} />
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden md:grid grid-cols-[repeat(auto-fit,minmax(400px,1fr))] gap-4 sm:gap-6 md:gap-8">
              {foods.map((food) => (
                <FoodCard food={food} key={food._id} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-white text-center py-10 sm:py-16 border border-gray-700 rounded-lg bg-[#353535]">
            Энэ ангилалд одоогоор бүтээгдэхүүн алга.
          </div>
        )}
      </div>
    </div>
  );
};
