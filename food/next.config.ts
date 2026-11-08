import type { NextConfig } from "next";

// Local development only: proxy /api/* to the Express API started with `npm run dev`
// in food-api. On Vercel, /api/* is routed to the food-api service by the root vercel.json.
const apiProxyUrl = process.env.API_PROXY_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!apiProxyUrl) return [];
    return [{ source: "/api/:path*", destination: `${apiProxyUrl}/api/:path*` }];
  },
};

export default nextConfig;
