import { useEffect, useState } from "react";
import { Check, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddCategory } from "./AddCategory";
import { CategoryType } from "../page";
import { api } from "@/axios";

type allFood = {
  countAllFood: number;
};
type CategoryProps = {
  getCategories: () => void;
  handleAllDishes: () => void;
  categories: CategoryType[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
};

export const CategoryMenu = ({
  getCategories,
  categories,
  selectedCategory,
  setSelectedCategory,
  handleAllDishes,
}: CategoryProps) => {
  const [showInput, setShowInput] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const [allFoods, setAllFoods] = useState<allFood>();
  const [categoryCounts, setCategoryCounts] = useState<Record<string, number>>(
    {}
  );

  const getAllFoods = async () => {
    try {
      const response = await api.get("/countAll");
      setAllFoods(response.data);
      console.log("food count:", response.data);
    } catch (error) {
      console.error("Error fetching all foods count:", error);
    }
  };

  const fetchAllCategoryCounts = async () => {
    try {
      const counts: Record<string, number> = {};

      for (const category of categories) {
        const { data } = await api.get(`/count?categoryId=${category._id}`);
        counts[category._id] = data.countFood;
      }

      setCategoryCounts(counts);
      console.log("Category counts fetched:", counts);
    } catch (error) {
      console.error("Error fetching category counts:", error);
    }
  };

  useEffect(() => {
    getAllFoods();
  }, []);

  useEffect(() => {
    if (categories.length > 0) {
      fetchAllCategoryCounts();
    }
  }, [categories]);

  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(false);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  return (
    <div className="p-6 flex flex-col gap-6 bg-white w-full rounded-xl relative">
      <h4 className="text-xl font-semibold">Ангилал</h4>
      <div className="flex gap-3 flex-wrap items-center ">
        <div
          className={`px-4 py-2 bg-white rounded-full flex gap-2 text-[14px] ${
            selectedCategory === ""
              ? " border border-[#EF4444]"
              : " border border-[#E4E4E7]"
          }`}
          onClick={handleAllDishes}
        >
          Бүгд
          <span className="bg-black rounded-full text-xs text-white px-[10px] py-[2px]">
            {allFoods?.countAllFood}
          </span>
        </div>
        {categories.map((category) => (
          <div
            key={category._id}
            className={`px-4 py-2 bg-white rounded-full flex gap-2 border  text-[14px] ${
              selectedCategory === category._id ? "border-[#EF4444]" : ""
            }`}
            onClick={() => setSelectedCategory(category._id)}
          >
            {category.categoryName}
            <span className="bg-black rounded-full text-xs text-white px-[10px] py-[2px]">
              {categoryCounts[category._id] || 0}
            </span>
          </div>
        ))}

        {!showInput && (
          <Button
            className="size-9 rounded-full bg-[#EF4444] flex items-center justify-center"
            onClick={() => setShowInput(true)}
          >
            <Plus className="text-white size-4" />
          </Button>
        )}
      </div>
      {showInput && (
        <AddCategory
          getCategories={getCategories}
          setShowInput={setShowInput}
          setSuccessMessage={setSuccessMessage}
        />
      )}
      {successMessage && (
        <div className="bg-black p-4 rounded-lg shadow-lg flex gap-2 items-center absolute top-[136px] left-1/2 transform -translate-x-1/2">
          <Check className="text-white size-4" />
          <p className="text-white">
            Шинэ ангилал нэмэгдлээ
          </p>
        </div>
      )}
    </div>
  );
};
