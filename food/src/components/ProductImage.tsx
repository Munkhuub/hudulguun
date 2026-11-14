import Image, { ImageProps } from "next/image";

// Hosts the custom loader (src/lib/image-loader.ts) knows how to resize.
const OPTIMIZED_HOSTS = new Set(["res.cloudinary.com"]);

type Props = Omit<ImageProps, "src"> & { src?: string | null };

/**
 * next/image that never crashes the page:
 * - upgrades http → https (Cloudinary returns http URLs; avoids mixed content in production)
 * - images from unknown hosts are shown unoptimized instead of throwing
 * - missing/invalid src → neutral placeholder
 */
export const ProductImage = ({ src, alt, className, ...rest }: Props) => {
  let url: URL | null = null;
  try {
    url = src ? new URL(src, "http://localhost") : null;
  } catch {
    url = null;
  }

  if (!src || !url) {
    return <div aria-label={typeof alt === "string" ? alt : undefined} role="img" className={`absolute inset-0 bg-[#1A1A1A]/5 ${className ?? ""}`} />;
  }

  const isRelative = src.startsWith("/");
  if (!isRelative && url.protocol === "http:") url.protocol = "https:";
  const finalSrc = isRelative ? src : url.toString();
  const unoptimized = !isRelative && !OPTIMIZED_HOSTS.has(url.hostname);

  return <Image src={finalSrc} alt={alt} className={className} unoptimized={unoptimized} {...rest} />;
};
