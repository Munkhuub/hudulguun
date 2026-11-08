import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";
import { FoodsTypeCategory } from "./CategoryFoods";
import { api } from "@/axios";

type FoodEditDeleteButtonProps = {
  food: FoodsTypeCategory;
  onDelete: () => void;
};

export const FoodEditDeleteButton = ({
  food,
  onDelete,
}: FoodEditDeleteButtonProps) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`"${food.foodName}"-г устгах уу?`)) {
      return;
    }
    try {
      setLoading(true);
      await api.delete(`/food/${food._id}`);
      onDelete();
    } catch (error) {
      console.error("Failed to delete food", error);
      alert("Устгаж чадсангүй. Дахин оролдоно уу.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="icon"
      className="w-12 h-10 border border-[#EF4444] bg-white hover:bg-[#DC2626]"
      onClick={handleDelete}
      disabled={loading}
    >
      <Trash className="size-4 text-[#EF4444] hover:text-white" />
    </Button>
  );
};
