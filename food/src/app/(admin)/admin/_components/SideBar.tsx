"use client";
import { useAuth } from "@/app/_providers/AuthProvider";
import { LayoutDashboardIcon, TruckIcon, MenuIcon, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export const SideBar = () => {
  const { user } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (!user) {
    return null;
  }
  if (user.role !== "admin") {
    return null;
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <button
        onClick={toggleMobileMenu}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-md shadow-md"
      >
        {isMobileMenuOpen ? (
          <XIcon className="size-6" />
        ) : (
          <MenuIcon className="size-6" />
        )}
      </button>

      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-40 transform transition-transform duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        w-[280px] sm:w-[320px] lg:w-[205px] px-4 sm:px-5 lg:px-5 py-6 sm:py-9 bg-white flex flex-col gap-6 sm:gap-10 lg:gap-10 shadow-xl
      `}
      >
        <div className="sticky top-6 sm:top-9">
          <Link href="/" onClick={closeMobileMenu}>
            <div className="flex gap-3 items-center">
              <div>
                <div className="font-display text-base font-semibold leading-[1.15] tracking-[0.3em]">
                  HUDUL
                  <br />
                  GUUN
                </div>
                <p className="text-xs text-gray-600">Админ</p>
              </div>
            </div>
          </Link>
        </div>

        <div className="flex flex-col gap-4 sm:gap-6 lg:gap-6 justify-center ml-2 sm:ml-6 lg:ml-6 sticky top-24 sm:top-30">
          <Link href="/admin" onClick={closeMobileMenu}>
            <div className="flex gap-3 lg:gap-[10px] items-center p-2 lg:p-0 rounded-lg lg:rounded-none hover:bg-gray-50 lg:hover:bg-transparent transition-colors">
              <LayoutDashboardIcon className="size-5 sm:size-[22px] lg:size-[22px]" />
              <p className="text-sm sm:text-base lg:text-base whitespace-nowrap">
                Бүтээгдэхүүн
              </p>
            </div>
          </Link>
          <Link href="/admin/orders" onClick={closeMobileMenu}>
            <div className="flex gap-3 lg:gap-[10px] items-center p-2 lg:p-0 rounded-lg lg:rounded-none hover:bg-gray-50 lg:hover:bg-transparent transition-colors">
              <TruckIcon className="size-5 sm:size-[22px] lg:size-[22px]" />
              <p className="text-sm sm:text-base lg:text-base whitespace-nowrap">
                Захиалга
              </p>
            </div>
          </Link>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={closeMobileMenu}
        />
      )}
    </>
  );
};
