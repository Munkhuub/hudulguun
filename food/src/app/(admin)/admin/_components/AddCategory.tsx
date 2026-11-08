import { api } from "@/axios";
import { Button } from "@/components/ui/button";
import { XIcon } from "lucide-react";
import { useState } from "react";

type AddCategoryProps = {
  getCategories: () => void;
  setShowInput: React.Dispatch<React.SetStateAction<boolean>>;
  setSuccessMessage: React.Dispatch<React.SetStateAction<boolean>>;
};
export const AddCategory = ({
  getCategories,
  setShowInput,
  setSuccessMessage,
}: AddCategoryProps) => {
  const [newCategoryName, setNewCategoryName] = useState("");
  const addCategory = async () => {
    try {
      if (!newCategoryName.trim()) return;

      const response = await api.post("/category", {
        categories: [{ categoryName: newCategoryName }],
      });
      console.log(response.data);

      setNewCategoryName("");
      setShowInput(false);
      setSuccessMessage(true);

      setTimeout(() => {
        setSuccessMessage(false);
      }, 2000);
      getCategories();
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className=" w-[420px] h-[272px] flex flex-col justify-between rounded-xl bg-white p-6 shadow-xs ">
        <div className="flex flex-col gap-6">
          <div className="flex justify-between h-[52px]">
            <p className="text-lg font-semibold">Шинэ ангилал</p>
            <Button
              onClick={() => {
                setShowInput(false);
                setNewCategoryName("");
              }}
              className="bg-gray-300 text-black px-3 py-1text-sm rounded-full size-9"
            >
              <XIcon className="size-4" />
            </Button>
          </div>
          <div className=" flex flex-col gap-2">
            <p className="text-[14px]">Ангиллын нэр</p>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder=""
              className="border border-[#E4E4E7] rounded-lg px-3 py-1 text-[14px] w-full h-[38px]"
            />
          </div>
        </div>

        <Button
          onClick={addCategory}
          className=" text-white px-4 py-[10px] rounded-lg text-sm w-[123px] ml-auto "
        >
          Нэмэх
        </Button>
      </div>
    </div>
  );
};
