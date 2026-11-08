"use client";

import { PropsWithChildren, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/_providers/AuthProvider";

// UI-level guard. Real protection is on the API (admin-only routes).
export const AdminGuard = ({ children }: PropsWithChildren) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!loading && !isAdmin) router.replace(user ? "/" : "/signin");
  }, [loading, isAdmin, user, router]);

  if (loading || !isAdmin) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center text-muted-foreground">
        Уншиж байна...
      </div>
    );
  }
  return <>{children}</>;
};
