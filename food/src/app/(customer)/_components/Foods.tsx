import { useCallback, useEffect, useState } from "react";
import { FoodCard } from "./FoodCard";
import { api } from "@/axios";
import { CategorySkeleton } from "./CategorySkeleton";

export type FoodsType = {
  foodName: string;
  ingredients: string;
  image: string;
  category: { categoryName: string };
  price: number;
  _id: string;
  variants?: string[];
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
  const [loading, setLoading] = useState(true);

  const getFoods = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await api.get(`/food?categoryId=${categoryId}`);
      setFoods(response.data.food || []);
    } catch (error) {
      console.error("Error fetching foods:", error);
      setError(true);
      setFoods([]);
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    getFoods();
  }, [getFoods]);

  // Real title + placeholder cards, so the section doesn't pop in late.
  if (loading) return <CategorySkeleton title={categoryName} />;

  if (!foods.length && !selectedCategory) return null;

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-6 pb-12 sm:px-6 sm:pb-16 lg:px-8">
      {selectedCategory === "" && (
        <h3 className="mb-4 text-sm font-semibold tracking-wider text-[#1A1A1A]/50 uppercase">
          {categoryName}
        </h3>
      )}
      {error ? (
        <div className="rounded-3xl bg-white px-4 py-12 text-center">
          <p className="mb-4 text-[#1A1A1A]/70">Бүтээгдэхүүн ачааллаж чадсангүй</p>
          <button
            onClick={getFoods}
            className="h-11 rounded-full bg-[#1A1A1A] px-6 text-sm font-semibold text-white hover:bg-black"
          >
            Дахин оролдох
          </button>
        </div>
      ) : foods.length > 0 ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {foods.map((food) => (
            <FoodCard food={food} key={food._id} />
          ))}
        </div>
      ) : (
        <div className="rounded-3xl bg-white px-4 py-12 text-center text-[#1A1A1A]/60">
          Энэ ангилалд одоогоор бүтээгдэхүүн алга.
        </div>
      )}
    </section>
  );
};
