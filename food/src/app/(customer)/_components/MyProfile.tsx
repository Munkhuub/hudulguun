import { useAuth } from "@/app/_providers/AuthProvider";
import { Button } from "@/components/ui/button";
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
import { ChevronRight, UserIcon } from "lucide-react";
import { useState, ChangeEvent } from "react";
import { UpdateProfileImage } from "./UpdateProfileImage";
import { api } from "@/axios";
import { toast } from "sonner";
import { AxiosError } from "axios";

interface User {
  _id: string;
  name: string;
  image?: string;
  email?: string;
}

interface UpdateUserRequest {
  name: string;
  image: string;
}

interface ApiErrorResponse {
  message: string;
}

interface MyProfileProps {
  className?: string;
}

export const MyProfile: React.FC<MyProfileProps> = ({ className }) => {
  const { user, setUser } = useAuth();
  const [userImage, setUserImage] = useState<string>(user?.image || "");
  const [userName, setUserName] = useState<string>(user?.name || "");
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  const updateUserProfile = async (): Promise<void> => {
    if (!userName.trim()) {
      setError("Нэрээ оруулна уу");
      return;
    }

    if (!user?._id) {
      setError("Хэрэглэгч олдсонгүй");
      return;
    }

    setIsSaving(true);
    setError("");

    try {
      const userId: string = user._id;
      const updateData: UpdateUserRequest = {
        name: userName.trim(),
        image: userImage,
      };
      await api.put<User>(`/user/${userId}`, updateData);

      setUser((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          name: userName.trim(),
          image: userImage,
        };
      });

      toast.success("Профайл хадгалагдлаа");
      setOpen(false);
    } catch (err) {
      console.error("Failed to update profile", err);

      const axiosError = err as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message ||
        "Профайл хадгалж чадсангүй. Дахин оролдоно уу.";
      setError(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleOpenChange = (isOpen: boolean): void => {
    setOpen(isOpen);
    if (isOpen) {
      setUserName(user?.name || "");
      setUserImage(user?.image || "");
      setError("");
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setUserName(e.target.value);
  };

  const handleImageChange = (url: string): void => {
    setUserImage(url);
  };

  const handleCancelClick = (): void => {
    setOpen(false);
  };

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`flex py-4 px-4 justify-between w-full rounded-lg hover:bg-gray-50 transition-colors group bg-white shadow-sm ${
            className || ""
          }`}
        >
          <div className="flex gap-3 items-center ">
            <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-sm">
              <UserIcon className="size-4 text-white" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-900">Миний профайл</p>
              <p className="text-xs text-gray-500">Бүртгэлээ удирдах</p>
            </div>
          </div>
          <ChevronRight className="size-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" />
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader className="pb-6 px-6">
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Профайл засах
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 px-6">
          <div className="flex items-start gap-6">
            <div className="flex flex-col items-center gap-2 min-w-0">
              <Label className="text-sm font-medium text-gray-700">
                Профайл зураг
              </Label>
              <UpdateProfileImage
                defaultValue={user.image}
                onChange={handleImageChange}
              />
            </div>

            <div className="flex-1 min-w-0">
              <Label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Овог нэр
              </Label>
              <Input
                id="name"
                type="text"
                className="w-full h-11 px-4 border-gray-300 focus:border-blue-500 focus:ring-blue-500 rounded-lg"
                placeholder="Нэрээ оруулна уу"
                value={userName}
                onChange={handleNameChange}
                disabled={isSaving}
                required
              />
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm text-red-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                {error}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="pt-6 px-6 gap-3">
          <Button
            variant="outline"
            onClick={handleCancelClick}
            disabled={isSaving}
            type="button"
            className="px-6 h-11 border-gray-300 hover:bg-gray-50 text-gray-700"
          >
            Болих
          </Button>
          <Button
            type="button"
            onClick={updateUserProfile}
            disabled={isSaving || !userName.trim()}
            className="px-6 h-11 bg-blue-600 hover:bg-blue-700 text-white shadow-sm disabled:bg-gray-300"
          >
            {isSaving ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Хадгалж байна...
              </div>
            ) : (
              "Хадгалах"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default MyProfile;
