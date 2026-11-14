import type { Metadata } from "next";
import { SideBar } from "./_components/SideBar";
import { AdminGuard } from "./_components/AdminGuard";

export const metadata: Metadata = { title: "Админ", robots: { index: false, follow: false } };

export default function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AdminGuard>
      <div className="flex lg:w-full m-auto min-h-[100vh]">
        <SideBar />
        {children}
      </div>
    </AdminGuard>
  );
}
