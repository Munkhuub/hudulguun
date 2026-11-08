"use client";

import { Header } from "./(customer)/_components/Header";
import { MainBanner } from "./(customer)/_components/MainBanner";
import { Categories } from "./(customer)/_components/Categories";
import { Footer } from "./(customer)/_components/Footer";
import { useEffect, useState } from "react";
import { Foods } from "./(customer)/_components/Foods";
import { api } from "@/axios";
import { CategorySkeleton } from "./(customer)/_components/CategorySkeleton";

export type CategoryType = {
  categoryName: string;
  _id: string;
};

export default function Home() {
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);

  const getCategories = async () => {
    try {
      setLoading(true);
      const response = await api.get("/category");
      setCategory(response.data.categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  const handleAllDishesClick = () => {
    setSelectedCategory("");
  };

  return (
    <div className="w-full">
      <div className="w-full mx-auto relative">
        <Header />
        <MainBanner />

        <div id="products" className="scroll-mt-20" />
        {loading ? (
          <>
            <div className="px-4 sm:px-6 md:px-8 lg:px-10 bg-[#404040] py-6 sm:py-8">
              <div className="h-6 bg-gray-300 rounded animate-pulse w-32 mb-4 sm:mb-6" />
              <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-8 sm:h-10 bg-gray-300 rounded-full animate-pulse w-20 sm:w-24"
                  />
                ))}
              </div>
            </div>

            <CategorySkeleton />
            <CategorySkeleton />
          </>
        ) : (
          <>
            <Categories
              setSelectedCategory={setSelectedCategory}
              category={category}
              selectedCategory={selectedCategory}
              handleAllDishesClick={handleAllDishesClick}
            />

            {category
              .filter((categories) => {
                if (selectedCategory === "") return true;
                return selectedCategory === categories._id;
              })
              .map((item) => (
                <div key={item._id}>
                  <Foods
                    categoryId={item._id}
                    categoryName={item.categoryName}
                    selectedCategory={selectedCategory}
                  />
                </div>
              ))}
          </>
        )}

        <Footer />
      </div>
    </div>
  );
}
