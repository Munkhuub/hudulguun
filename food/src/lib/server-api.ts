/**
 * Server-side only — never import this from "use client" files.
 * Calls from the `web` service to the `api` service.
 *
 * On Vercel, API_INTERNAL_URL is injected by the binding in the root vercel.json
 * (internal URL of the `api` service). It resolves at runtime in server functions only —
 * not during `next build` and not in middleware. Locally it falls back to API_PROXY_URL.
 *
 * Browser code keeps using `@/axios` (same-origin "/api").
 */
export const serverApiUrl = (path: string) => {
  const base = process.env.API_INTERNAL_URL || process.env.API_PROXY_URL;
  if (!base) throw new Error("API_INTERNAL_URL is not available (server functions only)");
  return new URL(`api/${path.replace(/^\/+/, "")}`, base.endsWith("/") ? base : `${base}/`);
};

export const serverFetch = (path: string, init?: RequestInit) =>
  fetch(serverApiUrl(path), init);
