"use client";

import { Header } from "./(customer)/_components/Header";
import { MainBanner } from "./(customer)/_components/MainBanner";
import { Categories } from "./(customer)/_components/Categories";
import { Footer } from "./(customer)/_components/Footer";
import { useEffect, useState } from "react";
import { Foods } from "./(customer)/_components/Foods";
import { api } from "@/axios";
import {
  CategoriesSkeleton,
  CategorySkeleton,
} from "./(customer)/_components/CategorySkeleton";

export type CategoryType = {
  categoryName: string;
  _id: string;
};

export default function Home() {
  const [category, setCategory] = useState<CategoryType[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const getCategories = async () => {
    try {
      setLoading(true);
      setLoadError(false);
      const response = await api.get("/category");
      setCategory(response.data.categories ?? []);
    } catch (error) {
      // warn, not error: the Next dev overlay pops up on console.error
      console.warn("Error fetching categories:", error);
      setCategory([]);
      setLoadError(true);
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
          <div role="status" aria-label="Ачааллаж байна">
            <CategoriesSkeleton />
            <CategorySkeleton />
          </div>
        ) : loadError ? (
          <div className="px-4 py-16 text-center">
            <p className="mb-4 text-[#1A1A1A]/70">
              Бүтээгдэхүүн ачааллаж чадсангүй. Түр хүлээгээд дахин оролдоно уу.
            </p>
            <button
              onClick={getCategories}
              className="rounded-full bg-[#1A1A1A] px-6 py-2 text-sm font-medium text-white hover:bg-black"
            >
              Дахин оролдох
            </button>
          </div>
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
