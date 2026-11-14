import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://hudulguun.vercel.app";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/checkout", "/signin", "/signup"] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
