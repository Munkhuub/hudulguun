// Loading placeholders that mirror the real layout (Categories + Foods + FoodCard),
// so nothing jumps when data arrives.

const pulse = "animate-pulse motion-reduce:animate-none bg-[#1A1A1A]/8";
const SECTION = "mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8";

/** Mirrors FoodCard. */
export const ProductCardSkeleton = () => (
  <div className="flex h-full w-full flex-col overflow-hidden rounded-3xl bg-white shadow-[0_8px_30px_-12px_rgba(26,26,26,0.18)]">
    <div className={`aspect-square w-full ${pulse}`} />
    <div className="flex flex-1 flex-col gap-2 p-4 sm:p-5">
      <div className={`h-6 w-3/5 rounded ${pulse}`} />
      <div className={`h-4 w-full rounded ${pulse}`} />
      <div className={`h-4 w-4/5 rounded ${pulse}`} />
      <div className={`mt-2 h-7 w-1/3 rounded ${pulse}`} />
      <div className={`h-12 w-full rounded-full ${pulse}`} />
    </div>
  </div>
);

/** Mirrors Foods' grid: 1 column on phones, 2 on tablets, 3 on desktop. */
export const ProductGridSkeleton = () => (
  <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
    <ProductCardSkeleton />
    <div className="hidden sm:block"><ProductCardSkeleton /></div>
    <div className="hidden lg:block"><ProductCardSkeleton /></div>
  </div>
);

/** A whole Foods section. Pass the real name once categories are known. */
export const CategorySkeleton = ({ title }: { title?: string }) => (
  <section className={`${SECTION} pt-6 pb-12 sm:pb-16`} aria-busy="true">
    {title ? (
      <h3 className="mb-4 text-sm font-semibold tracking-wider text-[#1A1A1A]/50 uppercase">{title}</h3>
    ) : (
      <div className={`mb-4 h-4 w-24 rounded ${pulse}`} />
    )}
    <ProductGridSkeleton />
  </section>
);

/** Mirrors Categories: heading + subtitle. */
export const CategoriesSkeleton = () => (
  <div className={`${SECTION} pt-12 sm:pt-16`}>
    <div className={`h-8 w-44 rounded ${pulse}`} />
    <div className={`mt-2 h-4 w-56 rounded ${pulse}`} />
  </div>
);
