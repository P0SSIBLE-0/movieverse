import HomePageClient from "@/components/home/HomePageClient";
import { getHomeCategoryFromSearchParam } from "@/features/home/config";

type HomePageProps = {
  searchParams: Promise<{
    category?: string | string[];
  }>;
};

export default async function Page({ searchParams }: HomePageProps) {
  const { category } = await searchParams;
  const activeCategory = getHomeCategoryFromSearchParam(category);

  return <HomePageClient activeCategory={activeCategory} />;
}
