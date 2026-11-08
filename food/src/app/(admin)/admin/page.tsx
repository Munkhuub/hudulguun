"use client";

import { CategoryMenu } from "./_components/CategoryMenu";
import { useEffect, useState } from "react";
import { CategoryFoods } from "./_components/CategoryFoods";
import { useAuth } from "@/app/_providers/AuthProvider";
import { api } from "@/axios";
import { CategorySkeleton } from "@/app/(customer)/_components/CategorySkeleton";

export type CategoryType = {
  _id: string;
  categoryName: string;
};

export default function Home() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [adminLoading, setAdminLoading] = useState(true);

  const { user } = useAuth();

  const getCategories = async () => {
    try {
      setAdminLoading(true);
      const { data } = await api.get("/category");
      setCategories(data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setAdminLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleAllDishesClick = () => {
    setSelectedCategory("");
  };

  if (!user) {
    return (
      <div className="min-h-screen w-full bg-[#E4E4E7] flex items-center justify-center px-4">
        <div className="text-gray-600">Ачааллаж байна...</div>
      </div>
    );
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen w-full bg-[#E4E4E7] flex items-center justify-center px-4">
        <div className="text-red-600 text-center max-w-md">
          <h2 className="text-xl sm:text-2xl font-bold mb-2">Хандах эрхгүй</h2>
          <p className="text-sm sm:text-base">
            Танд энэ хуудсанд хандах эрх байхгүй байна.
          </p>
        </div>
      </div>
    );
  }

  if (adminLoading) {
    return (
      <div className="min-h-screen w-full bg-[#E4E4E7] px-4 sm:px-6 lg:pl-6 lg:pr-10 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
        <div className="size-8 sm:size-9 bg-gray-300 ml-auto rounded-full animate-pulse" />

        <div className="p-4 sm:p-6 rounded-md bg-white flex flex-col gap-4">
          <div className="px-4 sm:px-22 bg-[#404040] py-6 sm:py-8 rounded-lg">
            <div className="h-5 sm:h-6 bg-gray-300 rounded animate-pulse w-24 sm:w-32 mb-3 sm:mb-4" />
            <div className="flex gap-2 sm:gap-4 overflow-x-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="h-8 sm:h-10 bg-gray-300 rounded animate-pulse w-20 sm:w-24 flex-shrink-0"
                />
              ))}
            </div>
          </div>
          <div className="space-y-4">
            <CategorySkeleton />
            <CategorySkeleton />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#E4E4E7] px-4 sm:px-6 lg:pl-6 lg:pr-10 py-4 sm:py-6 flex flex-col gap-4 sm:gap-6">
      <div className="size-8 sm:size-9 bg-black ml-auto rounded-full overflow-hidden border-2 border-white shadow-sm">
        <img
          src={user.image}
          alt={`${user.name || "User"} profile`}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="p-4 sm:p-6 rounded-lg bg-white shadow-sm border border-gray-200">
        <div className="mb-4 sm:mb-6">
          <CategoryMenu
            getCategories={getCategories}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            selectedCategory={selectedCategory}
            handleAllDishes={handleAllDishesClick}
          />
        </div>

        <div className="space-y-4 sm:space-y-6">
          {categories
            .filter((item) => {
              if (selectedCategory === "") return true;
              return selectedCategory === item._id;
            })
            .map(({ _id, categoryName }) => (
              <div
                key={_id}
                className="border-b border-gray-100 last:border-b-0 pb-4 sm:pb-6 last:pb-0"
              >
                <CategoryFoods categoryId={_id} categoryName={categoryName} />
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
