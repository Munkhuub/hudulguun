import { Button } from "@/components/ui/button";
import CartDetail from "./CartDetail";
import Link from "next/link";
import { useAuth } from "@/app/_providers/AuthProvider";
import { UserProfile } from "./UserProfile";

const pillBtn =
  "h-10 rounded-full border-none bg-white px-4 text-sm font-semibold text-[#1A1A1A] shadow-sm hover:bg-white/70";

export const Header = () => {
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1A1A1A]/5 bg-[#F4F2EF]/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="shrink-0 text-[#1A1A1A]" aria-label="Hudul Guun — нүүр хуудас">
          <div className="font-display text-base leading-[1.15] font-semibold tracking-[0.3em] sm:text-lg">
            HUDUL
            <br />
            GUUN
          </div>
          <p className="hidden text-[10px] text-[#1A1A1A]/60 sm:block">Play based learning tools</p>
        </Link>

        <div className="flex shrink-0 items-center gap-2">
          <CartDetail />

          {loading ? (
            <div className="h-10 w-20 animate-pulse rounded-full bg-[#1A1A1A]/8" />
          ) : user ? (
            <>
              {user.role === "admin" && (
                <Link href="/admin">
                  <Button variant="outline" className={pillBtn}>
                    Админ
                  </Button>
                </Link>
              )}
              <UserProfile />
            </>
          ) : (
            <>
              <Link href="/signin">
                <Button variant="outline" className={pillBtn}>
                  Нэвтрэх
                </Button>
              </Link>
              <Link href="/signup" className="hidden sm:block">
                <Button className="h-10 rounded-full bg-[#1A1A1A] px-4 text-sm font-semibold text-white hover:bg-black">
                  Бүртгүүлэх
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};
