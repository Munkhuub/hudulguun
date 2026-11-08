import { SideBar } from "./_components/SideBar";
import { AdminGuard } from "./_components/AdminGuard";

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
