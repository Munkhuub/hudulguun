import { Button } from "@/components/ui/button";
import axios from "axios";
import { Plus, XIcon } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { api } from "@/axios";
import { parseVariants, VARIANTS_HINT } from "./variants";

const UPLOAD_PRESET = "foodWebApp";
const CLOUD_NAME = "dpbmpprw5";

type AddFoodProps = {
  getFoods: () => Promise<void>;
  categoryId: string;
  categoryName: string;
};

export const AddFood = ({
  getFoods,
  categoryId,
  categoryName,
}: AddFoodProps) => {
  const [loading, setLoading] = useState(false);
  const [deployedImg, setDeployedImg] = useState("");
  const [open, setOpen] = useState(false);
  const [foodName, setFoodName] = useState("");
  const [price, setPrice] = useState("");
  const [ingredients, setТайлбар] = useState("");
  const [variants, setVariants] = useState("");

  const uploadImage = async (file: File | undefined) => {
    if (!file) {
      return null;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      const result = response.data.secure_url || response.data.url;
      return result;
    } catch (error) {
      console.error("Image upload failed:", error);
      return null;
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      const imageUrl = await uploadImage(file);
      if (imageUrl) {
        setDeployedImg(imageUrl);
      } else {
        setDeployedImg("");
        toast.error("Зураг хуулж чадсангүй");
      }
      setLoading(false);
    }
  };

  const handleCreate = async () => {
    try {
      setLoading(true);

      if (!deployedImg) {
        toast.error("Зураг оруулна уу");
        setLoading(false);
        return;
      }

      await api.post("/food/oneFood", {
        foodName,
        price: Number(price),
        image: deployedImg,
        ingredients,
        variants: parseVariants(variants),
        category: categoryId,
      });

      toast.success("Бүтээгдэхүүн нэмэгдлээ");
      await getFoods();
      setOpen(false);
      setFoodName("");
      setPrice("");
      setТайлбар("");
      setVariants("");
      setDeployedImg("");
    } catch (error) {
      console.error("Error creating food:", error);
      toast.error("Бүтээгдэхүүн нэмж чадсангүй");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="w-full aspect-[270/241] border border-dashed border-[#EF4444] rounded-[20px] flex flex-col gap-3 sm:gap-6 justify-center items-center cursor-pointer p-4">
          <Button className="size-8 sm:size-10 rounded-full bg-[#EF4444] flex items-center justify-center">
            <Plus className="text-white size-3 sm:size-4" />
          </Button>
          <div className="text-xs sm:text-[14px] text-center leading-tight">
            Шинэ бүтээгдэхүүн: <br /> {categoryName}
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-base sm:text-lg">
            Шинэ бүтээгдэхүүн: {categoryName}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="food-name" className="text-left">
                Бүтээгдэхүүний нэр
              </Label>
              <Input
                id="food-name"
                value={foodName}
                className="w-full"
                onChange={(e) => setFoodName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <Label htmlFor="food-price" className="text-left">
                Үнэ (₮)
              </Label>
              <Input
                type="number"
                value={price}
                className="w-full"
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="ingredients" className="text-left">
              Тайлбар
            </Label>
            <Textarea
              value={ingredients}
              className="h-[90px] resize-none"
              onChange={(e) => setТайлбар(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="food-variants" className="text-left">
              Өнгө (заавал биш)
            </Label>
            <Input
              id="food-variants"
              value={variants}
              placeholder="Бүдэг өнгө, Тод өнгө"
              onChange={(e) => setVariants(e.target.value)}
            />
            <p className="text-xs text-[#71717A]">{VARIANTS_HINT}</p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="food-image" className="text-left">
              Зураг
            </Label>
            {deployedImg ? (
              <div className="relative w-full h-[120px] sm:h-[150px] border rounded-md overflow-hidden flex items-center justify-center">
                <img
                  src={deployedImg}
                  alt="Бүтээгдэхүүний зураг"
                  className="object-cover w-full h-full"
                />

                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-2 right-2 rounded-full size-8"
                  onClick={() => setDeployedImg("")}
                >
                  <XIcon className="size-4" />
                </Button>
              </div>
            ) : (
              <Input
                id="food-image"
                className="h-[60px] sm:h-[90px] cursor-pointer"
                onChange={handleFileChange}
                type="file"
                accept="image/*"
              />
            )}
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button
            type="submit"
            onClick={handleCreate}
            disabled={
              loading || !deployedImg || !foodName || !price || !ingredients
            }
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                Хадгалж байна... <span className="ml-2 animate-spin">🌀</span>
              </>
            ) : (
              "Хадгалах"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
