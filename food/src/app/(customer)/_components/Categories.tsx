import { CategoryType } from "@/app/page";

type CategoryProps = {
  category: CategoryType[];
  setSelectedCategory: React.Dispatch<React.SetStateAction<string>>;
  selectedCategory: string;
  handleAllDishesClick: () => void;
};

const pill = (active: boolean) =>
  `h-10 shrink-0 rounded-full px-5 text-sm font-semibold whitespace-nowrap transition-colors ${
    active
      ? "bg-[#1A1A1A] text-white"
      : "bg-white text-[#1A1A1A] hover:bg-[#1A1A1A]/5"
  }`;

export const Categories = ({
  category,
  selectedCategory,
  setSelectedCategory,
  handleAllDishesClick,
}: CategoryProps) => {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 pt-12 sm:px-6 sm:pt-16 lg:px-8">
      <h2 className="text-2xl font-bold sm:text-3xl">Бүтээгдэхүүн</h2>
      <p className="mt-1 text-sm text-[#1A1A1A]/60 sm:text-base">
        Тоглоомоор хөгжих хэрэгслүүд
      </p>

      {/* A filter with a single category is noise — only show it when there's a choice. */}
      {category.length > 1 && (
        <div className="-mx-4 mt-5 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide sm:mx-0 sm:px-0">
          <button
            className={pill(selectedCategory === "")}
            onClick={handleAllDishesClick}
          >
            Бүгд
          </button>
          {category.map((c) => (
            <button
              key={c._id}
              className={pill(selectedCategory === c._id)}
              onClick={() => setSelectedCategory(c._id)}
            >
              {c.categoryName}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
