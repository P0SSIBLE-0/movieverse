"use client";

import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import ContentRow from "@/components/ContentRow";
import CategoryFilter from "@/components/CategoryFilter";
import { useAppShell } from "@/components/AppShell";
import { HOME_SECTIONS, type HomeCategory } from "@/features/home/config";

type HomePageClientProps = {
  activeCategory: HomeCategory;
};

export default function HomePageClient({
  activeCategory,
}: HomePageClientProps) {
  const { toggleSidebar } = useAppShell();
  const visibleSections = HOME_SECTIONS.filter((section) =>
    section.visibleIn.includes(activeCategory)
  );

  return (
    <div className="pb-16 md:pb-4">
      <Header onMenuClick={toggleSidebar} />
      <HeroBanner />
      <CategoryFilter activeCategory={activeCategory} />

      <div className="px-2 md:px-4 lg:px-6">
        {visibleSections.map((section) => (
          <ContentRow
            key={section.title}
            title={section.title}
            fetchFunction={section.fetchFunction}
            apiParams={section.apiParams}
            mediaType={section.mediaType}
          />
        ))}
      </div>
    </div>
  );
}
