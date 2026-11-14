// Custom next/image loader.
// Vercel's /_next/image optimizer is not served in this multi-service setup (returns 404),
// so images are resized by Cloudinary itself, and local /public images are served as-is.
type LoaderArgs = { src: string; width: number; quality?: number };

export default function imageLoader({ src, width, quality }: LoaderArgs): string {
  if (src.startsWith("/")) {
    // Static file; the query only keeps srcset entries distinct.
    return `${src}?w=${width}`;
  }
  try {
    const url = new URL(src);
    if (url.hostname === "res.cloudinary.com" && url.pathname.includes("/image/upload/")) {
      url.protocol = "https:";
      const t = `f_auto,q_${quality ?? "auto"},w_${width},c_limit`;
      url.pathname = url.pathname.replace("/image/upload/", `/image/upload/${t}/`);
      return url.toString();
    }
  } catch {
    // fall through
  }
  return src;
}
