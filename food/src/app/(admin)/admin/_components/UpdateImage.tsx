import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { XIcon } from "lucide-react";
import { useState } from "react";

const UPLOAD_PRESET = "foodWebApp";
const CLOUD_NAME = "dpbmpprw5";

type UpdateImageProps = {
  defaultValue?: string;
  onChange: (imageUrl: string) => void;
};

export const UpdateImage = ({ defaultValue, onChange }: UpdateImageProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    defaultValue || null
  );

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);

    setIsUploading(true);
    try {
      const uploadedUrl = await uploadImage(file);
      if (uploadedUrl) {
        onChange(uploadedUrl);
      }
    } catch (error) {
      console.error("Image upload failed", error);
      setPreviewUrl(defaultValue || null);
    } finally {
      setIsUploading(false);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);

    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.secure_url;
  };

  const handleClear = () => {
    setPreviewUrl(null);
    onChange("");
  };

  return (
    <div className="col-span-3">
      {!previewUrl ? (
        <div className="w-[288px]">
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isUploading}
            className="w-full cursor-pointer"
          />
          {isUploading && (
            <p className="text-sm text-amber-600 mt-1">Зураг хуулж байна...</p>
          )}
        </div>
      ) : (
        <div className="w-[288px] h-[116px] relative">
          <img
            src={previewUrl}
            className="w-full h-full object-cover rounded-md"
            alt="Зураг"
          />
          <Button
            type="button"
            onClick={handleClear}
            className="absolute top-2 right-2 rounded-full bg-white hover:bg-gray-200 size-8 p-0"
            disabled={isUploading}
          >
            <XIcon className="size-4" />
          </Button>
          {isUploading && (
            <div className="absolute inset-0 bg-black/30 flex items-center justify-center rounded-md">
              <p className="text-white font-medium">Хуулж байна...</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
