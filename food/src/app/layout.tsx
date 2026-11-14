import type { Metadata, Viewport } from "next";
import { Nunito, Unbounded } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { CartProvider } from "./(customer)/_components/CartContext";
import { AuthProvider } from "./_providers/AuthProvider";

const nunito = Nunito({
  variable: "--font-nunito",
  subsets: ["latin", "cyrillic", "cyrillic-ext"], // ext = Mongolian ү, ө
  display: "swap",
});

const unbounded = Unbounded({
  variable: "--font-unbounded",
  subsets: ["latin", "cyrillic", "cyrillic-ext"], // ext = Mongolian ү, ө
  display: "swap",
});

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hudulguun.vercel.app";
const TITLE = "Мэдрэхүйн матт — Hudul Guun";
const DESCRIPTION =
  "Хүүхдийн мэдрэхүй, тэнцвэр, хөдөлгөөнийг хөгжүүлэх 6 өөр гадаргуутай мэдрэхүйн матт. Урьдчилсан захиалга 89,000₮.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: TITLE, template: "%s — Hudul Guun" },
  description: DESCRIPTION,
  applicationName: "Hudul Guun",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "mn_MN",
    url: "/",
    siteName: "Hudul Guun",
    title: TITLE,
    description: DESCRIPTION,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "Мэдрэхүйн матт — 89,000₮" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESCRIPTION, images: ["/og.jpg"] },
};

export const viewport: Viewport = {
  themeColor: "#F4F2EF",
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
