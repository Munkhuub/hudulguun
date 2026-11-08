import type { Metadata } from "next";
import { Nunito, Unbounded } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "./(customer)/_components/CartContext";
import { AuthProvider } from "./_providers/AuthProvider";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Hudul Guun — Хүүхдийн хөгжлийн тоглоом",
  description:
    "Хүүхдийн мэдрэхүй, тэнцвэр, хөдөлгөөнийг хөгжүүлэх мэдрэхүйн матт. Play based learning tools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn">
      <body
        className={`${nunito.variable} ${unbounded.variable} font-sans antialiased`}
      >
        <AuthProvider>
          <CartProvider>
            {children}
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
