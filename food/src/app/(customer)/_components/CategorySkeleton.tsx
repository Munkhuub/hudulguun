export const CategorySkeleton = () => {
  return (
    <div className="px-4 sm:px-6 md:px-8 lg:px-10 bg-[#404040] pb-6 sm:pb-8 md:pb-10 lg:pb-[54px]">
      <div className="h-6 sm:h-7 md:h-8 bg-gray-300 rounded animate-pulse w-32 sm:w-40 md:w-48 mb-4 sm:mb-6 md:mb-8 lg:mb-[54px]" />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="w-full bg-white rounded-xl md:rounded-[20px] overflow-hidden shadow-sm"
          >
            <div className="p-3 sm:p-4 flex flex-col gap-2 sm:gap-3">
              <div className="aspect-[1.9/1] w-full bg-gray-300 rounded-lg animate-pulse" />

              <div className="flex flex-col gap-2 sm:gap-3 mt-1">
                <div className="flex justify-between items-start">
                  <div className="h-4 sm:h-5 bg-gray-300 rounded animate-pulse w-3/5" />
                  <div className="h-4 sm:h-5 bg-gray-300 rounded animate-pulse w-1/5" />
                </div>

                <div className="flex flex-col gap-1.5 sm:gap-2">
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-full" />
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-4/5" />
                  <div className="h-3 bg-gray-300 rounded animate-pulse w-3/5 sm:hidden" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
