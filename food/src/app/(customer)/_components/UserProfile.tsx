import { useAuth } from "@/app/_providers/AuthProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Profile } from "./_assets/Profile";
import { useEffect, useState } from "react";
import MyProfile from "./MyProfile";
import { LogOut, User } from "lucide-react";

interface User {
  _id: string;
  name: string;
  email: string;
  image?: string;
}

export const UserProfile: React.FC = () => {
  const { user, signOut, loading } = useAuth();
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "Хэрэглэгч");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleSignOut = (): void => {
    signOut();
    setOpen(false);
  };

  if (loading) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse flex items-center justify-center">
        <User className="w-5 h-5 text-gray-400" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-gradient-to-br from-red-500 to-red-600 border-none hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Profile />
        </Button>
      </DialogTrigger>

      <DialogContent
        className="sm:max-w-[320px] p-0 overflow-hidden bg-white shadow-2xl border-0"
        aria-describedby="dialog-description"
      >
        <div id="dialog-description" className="sr-only">
          Хэрэглэгчийн мэдээлэл
        </div>

        <DialogHeader className="px-6 py-4 bg-gradient-to-r from-gray-50 to-white border-b border-gray-100">
          <DialogTitle className="text-left">
            <div className="flex gap-3 items-center">
              <div>
                {user.image ? (
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-12 h-12 rounded-full object-cover bg-gray-200 ring-2 ring-white shadow-sm"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center ring-2 ring-white shadow-sm">
                    <User className="w-6 h-6 text-white" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {name}
                </p>
                <p className="text-xs text-gray-500 truncate">{email}</p>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 py-4 space-y-3">
          <MyProfile />

          <div className="pt-3 border-t border-gray-100">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              type="button"
              className="w-full justify-start gap-3 px-3 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors rounded-lg"
            >
              <div className="p-2 bg-red-50 rounded-lg">
                <LogOut className="w-4 h-4" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">Гарах</p>
                <p className="text-xs text-gray-500">
                  Бүртгэлээсээ гарах
                </p>
              </div>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
