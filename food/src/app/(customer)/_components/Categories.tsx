import { CategoryType } from "@/app/page";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef, useState, useEffect } from "react";

type CategoryProps = {
  category: CategoryType[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  handleAllDishesClick: () => void;
};

export const Categories = ({
  category,
  selectedCategory,
  setSelectedCategory,
  handleAllDishesClick,
}: CategoryProps) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleScrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const handleScrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        scrollContainerRef.current;
      const isAtStart = scrollLeft <= 10;
      const isAtEnd = scrollLeft + clientWidth >= scrollWidth - 10;

      setShowLeftArrow(!isAtStart);
      setShowRightArrow(!isAtEnd);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, []);

  useEffect(() => {
    setTimeout(checkScroll, 100);
  }, [category]);

  return (
    <div className="w-full bg-[#404040] px-4 sm:px-6 md:px-8 lg:px-12 py-6 sm:py-8 flex flex-col gap-4 sm:gap-6 md:gap-8">
      <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-white">
        Ангилал
      </h1>

      <div className="flex items-center relative">
        {!isMobile && (
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 z-10 flex-shrink-0 border-none shadow-none bg-black/50 hover:bg-black/70 rounded-full ${
              !showLeftArrow ? "invisible" : ""
            }`}
            onClick={handleScrollLeft}
          >
            <ChevronLeft className="text-white" size={20} />
          </Button>
        )}

        <div
          className="flex gap-2 overflow-x-auto scroll-smooth flex-nowrap w-full"
          ref={scrollContainerRef}
          onScroll={checkScroll}
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
            padding: isMobile ? "0 8px" : "0",
          }}
        >
          <button
            className={`px-4 py-1 md:px-5 md:py-1 rounded-full text-xs sm:text-sm ${
              selectedCategory === ""
                ? "bg-[#EF4444] text-white"
                : "bg-white text-black hover:bg-gray-100"
            } whitespace-nowrap flex-shrink-0 transition-colors`}
            onClick={handleAllDishesClick}
          >
            Бүгд
          </button>

          {category?.map((categories) => (
            <button
              className={`px-4 py-1 md:px-5 md:py-1 rounded-full whitespace-nowrap flex-shrink-0 text-xs sm:text-sm ${
                selectedCategory === categories._id
                  ? "bg-[#EF4444] text-white"
                  : "bg-white text-black hover:bg-gray-100"
              } transition-colors`}
              key={categories._id}
              onClick={() => setSelectedCategory(categories._id)}
            >
              {categories.categoryName}
            </button>
          ))}
        </div>

        {!isMobile && (
          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 z-10 flex-shrink-0 border-none shadow-none bg-black/50 hover:bg-black/70 rounded-full ${
              !showRightArrow ? "invisible" : ""
            }`}
            onClick={handleScrollRight}
          >
            <ChevronRight className="text-white" size={20} />
          </Button>
        )}
      </div>

      {isMobile && (
        <div className="flex justify-center gap-2 mt-2">
          <div
            className={`w-2 h-2 rounded-full ${
              showLeftArrow ? "bg-white" : "bg-gray-500"
            }`}
          />
          <div
            className={`w-2 h-2 rounded-full ${
              showRightArrow ? "bg-white" : "bg-gray-500"
            }`}
          />
        </div>
      )}
    </div>
  );
};
