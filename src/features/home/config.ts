import { fetchPopular, fetchTopRated, fetchTrending } from "@/services/tmdbApi";
import type { ContentRowProps, ExploreCategory } from "@/types";

export type HomeCategory = Extract<ExploreCategory, "all" | "movie" | "tv">;

type HomeCategoryItem = {
  label: string;
  href: string;
  value: HomeCategory;
};

type HomeSection = ContentRowProps & {
  visibleIn: readonly HomeCategory[];
};

export const DEFAULT_HOME_CATEGORY: HomeCategory = "all";

export const HOME_CATEGORIES: readonly HomeCategoryItem[] = [
  {
    label: "All",
    href: "/",
    value: "all",
  },
  {
    label: "Movies",
    href: "/?category=movie",
    value: "movie",
  },
  {
    label: "TV Shows",
    href: "/?category=tv",
    value: "tv",
  },
] as const;

export const HOME_SECTIONS: readonly HomeSection[] = [
  {
    title: "Trending Movies",
    fetchFunction: fetchTrending,
    apiParams: ["movie", "day"],
    mediaType: "movie",
    visibleIn: ["all", "movie"],
  },
  {
    title: "Trending Shows",
    fetchFunction: fetchTrending,
    apiParams: ["tv", "day"],
    mediaType: "tv",
    visibleIn: ["all", "tv"],
  },
  {
    title: "Popular Movies",
    fetchFunction: fetchPopular,
    apiParams: ["movie"],
    mediaType: "movie",
    visibleIn: ["all", "movie"],
  },
  {
    title: "Top Rated TV Shows",
    fetchFunction: fetchTopRated,
    apiParams: ["tv"],
    mediaType: "tv",
    visibleIn: ["all", "tv"],
  },
];

export function isHomeCategory(value: string): value is HomeCategory {
  return HOME_CATEGORIES.some((category) => category.value === value);
}

export function getHomeCategoryFromSearchParam(
  value: string | string[] | undefined
): HomeCategory {
  const normalizedValue = Array.isArray(value) ? value[0] : value;

  if (!normalizedValue) {
    return DEFAULT_HOME_CATEGORY;
  }

  return isHomeCategory(normalizedValue)
    ? normalizedValue
    : DEFAULT_HOME_CATEGORY;
}
