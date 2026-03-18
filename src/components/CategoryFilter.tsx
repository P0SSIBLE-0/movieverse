import Link from "next/link";
import { HOME_CATEGORIES, type HomeCategory } from "@/features/home/config";

type CategoryFilterProps = {
  activeCategory: HomeCategory;
};

export default function CategoryFilter({
  activeCategory,
}: CategoryFilterProps) {
  return (
    <div className="relative mb-4 px-2 py-3 md:px-4 mask-r-from-50% mask-r-to-90%">
      <div className="flex items-center space-x-2 overflow-auto scrollbar-hide">
        {HOME_CATEGORIES.map((category) => (
          <Link
            key={category.value}
            href={category.href}
            scroll={false}
            aria-current={
              activeCategory === category.value ? "page" : undefined
            }
            className={`inline-flex min-w-[100px] items-center justify-center rounded-full px-4 py-2 text-sm font-medium whitespace-nowrap border border-zinc-800 transition-all duration-200 ${activeCategory === category.value
              ? "bg-zinc-900/80 text-brand-text-dark"
              : "bg-brand-inactive-tab text-brand-text-primary hover:bg-opacity-80"
              } ${category.value === "all" ? "min-w-[60px]" : ""}`}
          >
            {category.label}
          </Link>
        ))}
      </div>


    </div>
  );
}
