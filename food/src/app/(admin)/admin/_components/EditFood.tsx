import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { FoodsTypeCategory } from "./CategoryFoods";
import { CategorySelect } from "./CategorySelect";
import { UpdateImage } from "./UpdateImage";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FoodEditDeleteButton } from "./FoodEditDeleteButton";
import { api } from "@/axios";
import { toast } from "sonner";
import { parseVariants, VARIANTS_HINT } from "./variants";

type CategoryEditProps = {
  food: FoodsTypeCategory;
  categoryId: string;
  getFoods: () => Promise<void>;
};

const formSchema = z.object({
  foodName: z.string().min(1, "Нэр оруулна уу"),
  ingredients: z.string().min(1, "Тайлбар оруулна уу"),
  variants: z.string(),
  price: z.number().positive("Үнэ 0-ээс их байх ёстой"),
  categoryId: z.string().min(1, "Ангилал сонгоно уу"),
  image: z.string().url("Зураг оруулна уу"),
});

type FormValues = z.infer<typeof formSchema>;

export const EditFood = ({ food, categoryId, getFoods }: CategoryEditProps) => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const {
    register,
    setValue,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      foodName: food.foodName,
      ingredients: food.ingredients,
      variants: (food.variants ?? []).join(", "),
      price: food.price,
      categoryId: categoryId,
      image: food.image || "",
    },
  });

  const handleUpdate = async (data: FormValues) => {
    try {
      setLoading(true);

      const { categoryId: category, variants, ...rest } = data;
      await api.put(`/food/${food._id}`, { ...rest, category, variants: parseVariants(variants) });

      toast.success("Бүтээгдэхүүн шинэчлэгдлээ");
      setOpen(false);
      await getFoods();
    } catch (error) {
      console.error("Failed to update food:", error);
      toast.error("Бүтээгдэхүүн шинэчилж чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = (value: string) => {
    setValue("categoryId", value);
  };

  const handleImageChange = (imageUrl: string) => {
    setValue("image", imageUrl, {
      shouldValidate: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          className="absolute rounded-full right-9 top-[81px] bg-white size-11"
          size="icon"
        >
          <Pencil className="text-[#EF4444] size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[472px] text-[14px]">
        <DialogHeader>
          <DialogTitle>Бүтээгдэхүүн засах</DialogTitle>
        </DialogHeader>

        <form className="grid gap-4 py-4" onSubmit={handleSubmit(handleUpdate)}>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="foodName"
              className="text-right text-[#71717A] text-xs mb-auto"
            >
              Нэр
            </Label>
            <div className="col-span-3">
              <Input
                id="foodName"
                {...register("foodName")}
                className={`w-[288px] ${
                  errors.foodName ? "border-red-500" : ""
                }`}
              />
              {errors.foodName && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.foodName.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="categories"
              className="text-right text-[#71717A] text-xs mb-auto"
            >
              Ангилал
            </Label>
            <div className="col-span-3 w-[288px] text-xs">
              <CategorySelect
                selectedValue={watch("categoryId")}
                onValueChange={handleCategoryChange}
              />
              {errors.categoryId && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.categoryId.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="ingredients"
              className="text-right text-[#71717A] text-xs mb-auto"
            >
              Тайлбар
            </Label>
            <div className="col-span-3">
              <textarea
                id="ingredients"
                {...register("ingredients")}
                className={`w-[288px] h-[80px] border rounded-md py-2 px-3 ${
                  errors.ingredients ? "border-red-500" : "border-input"
                }`}
              />
              {errors.ingredients && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.ingredients.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="variants" className="text-right text-[#71717A] text-xs mt-2">
              Өнгө
            </Label>
            <div className="col-span-3">
              <input
                id="variants"
                {...register("variants")}
                placeholder="Бүдэг өнгө, Тод өнгө"
                className="w-[288px] h-9 border border-input rounded-md px-3 text-sm"
              />
              <p className="mt-1 w-[288px] text-xs text-[#71717A]">{VARIANTS_HINT}</p>
            </div>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label
              htmlFor="price"
              className="text-right text-[#71717A] text-xs mb-auto"
            >
              Үнэ (₮)
            </Label>
            <div className="col-span-3">
              <Input
                id="price"
                type="number"
                step="0.01"
                {...register("price", { valueAsNumber: true })}
                className={`w-[288px] ${errors.price ? "border-red-500" : ""}`}
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-4 items-start gap-4">
            <Label
              htmlFor="image"
              className="text-right text-[#71717A] text-xs mb-auto"
            >
              Зураг
            </Label>
            <UpdateImage onChange={handleImageChange} />
            {errors.image && (
              <p className="text-red-500 text-sm mt-1 col-start-2 col-span-3">
                {errors.image.message}
              </p>
            )}
          </div>
          <div className="flex justify-between">
            <FoodEditDeleteButton food={food} onDelete={getFoods} />
            <DialogFooter>
              <Button
                type="submit"
                disabled={loading}
                className="hover:bg-[#DC2626] h-10 mr-6"
              >
                {loading ? "Хадгалж байна..." : "Хадгалах"}
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
