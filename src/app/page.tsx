'use client';

import { useState } from "react";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import CategoryFilter from "@/components/CategoryFilter";
import Header from "@/components/Header";
import { useAppShell } from "@/components/AppShell";
import {
  fetchTrending,
  fetchPopular,
  fetchTopRated,
} from "@/services/tmdbApi";
import type { ExploreCategory } from "@/types";

export default function Page() {
  const [activeCategory, setActiveCategory] = useState<ExploreCategory | 'all'>("all");
  const { toggleSidebar } = useAppShell();

  const handleCategoryChange = (category: ExploreCategory | 'all') => {
    setActiveCategory(category);
  };

  return (
    <div className="pb-16 md:pb-4">
      <Header onMenuClick={toggleSidebar} />
      <HeroBanner />
      <CategoryFilter
        activeCategory={activeCategory}
        onCategoryChange={handleCategoryChange}
      />
      <div className="px-2 md:px-4 lg:px-6">
        {(activeCategory === "all" || activeCategory === "movie") && (
          <ContentRow
            title="Trending Movies"
            fetchFunction={fetchTrending}
            apiParams={["movie", "day"]}
            mediaType="movie"
          />
        )}
        {(activeCategory === "all" || activeCategory === "tv") && (
          <ContentRow
            title="Trending Shows"
            fetchFunction={fetchTrending}
            apiParams={["tv", "day"]}
            mediaType="tv"
          />
        )}
        {(activeCategory === "all" || activeCategory === "movie") && (
          <ContentRow
            title="Popular Movies"
            fetchFunction={fetchPopular}
            apiParams={["movie"]}
            mediaType="movie"
          />
        )}
        {(activeCategory === "all" || activeCategory === "tv") && (
          <ContentRow
            title="Top Rated TV Shows"
            fetchFunction={fetchTopRated}
            apiParams={["tv"]}
            mediaType="tv"
          />
        )}
      </div>
    </div>
  );
};