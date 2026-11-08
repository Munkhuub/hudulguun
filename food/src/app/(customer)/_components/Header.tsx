import { Button } from "@/components/ui/button";
import DeliveryAddress from "./DeliveryAddress";
import CartDetail from "./CartDetail";
import Link from "next/link";
import { useAuth } from "@/app/_providers/AuthProvider";
import { UserProfile } from "./UserProfile";

export const Header = () => {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-black/5 bg-[#F4F2EF]/85 px-4 py-3 backdrop-blur sm:px-6 md:px-8 lg:px-10">
      <div className="flex items-center justify-between flex-wrap gap-x-4 gap-y-2 max-w-7xl mx-auto">
        <Link href="/" className="flex-shrink-0 text-[#1A1A1A]" aria-label="Hudul Guun — нүүр хуудас">
          <div className="font-display text-base font-semibold leading-[1.15] tracking-[0.3em] sm:text-lg">
            HUDUL
            <br />
            GUUN
          </div>
          <p className="hidden text-[10px] text-[#1A1A1A]/60 sm:block">Play based learning tools</p>
        </Link>

        <div className="sm:hidden order-last w-full basis-full overflow-hidden">
          <div className="w-full [&>*]:w-full [&>*]:max-w-full [&>*]:text-xs [&>*>*]:truncate">
            <DeliveryAddress />
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-shrink-0">
          <div className="hidden sm:block">
            <DeliveryAddress />
          </div>

          <CartDetail />

          {loading ? (
            <div className="flex gap-2 sm:gap-3">
              <div className="w-16 sm:w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
              <div className="w-16 sm:w-20 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            </div>
          ) : user ? (
            <div className="flex items-center gap-2 sm:gap-3">
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button
                    variant="outline"
                    className="rounded-full bg-white border-none text-[#71717A] hover:bg-gray-100 text-xs sm:text-sm px-3 sm:px-4 py-1 transition-colors"
                    size="sm"
                  >
                    Админ
                  </Button>
                </Link>
              )}
              <UserProfile />
            </div>
          ) : (
            <div className="flex gap-2 sm:gap-3">
              <Link href="/signin">
                <Button
                  variant="outline"
                  className="rounded-full bg-white border-none text-[#71717A] hover:bg-gray-100 text-xs sm:text-sm px-3 sm:px-4 py-1 transition-colors"
                  size="sm"
                >
                  Нэвтрэх
                </Button>
              </Link>
              <Link href="/signup" className="hidden min-[380px]:block">
                <Button
                  variant="outline"
                  className="rounded-full bg-white border-none text-[#71717A] hover:bg-gray-100 text-xs sm:text-sm px-3 sm:px-4 py-1 transition-colors"
                  size="sm"
                >
                  Бүртгүүлэх
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
