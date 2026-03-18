import type { Metadata } from "next";
import { notFound } from "next/navigation";
import MediaDetailsPageClient from "@/components/details/MediaDetailsPageClient";
import { generateMediaMetadata } from "@/lib/mediaMetadata";
import type { MediaType } from "@/types";

type MediaDetailsPageProps = {
  params: Promise<{
    mediaType: string;
    id: string;
  }>;
};

function isMediaType(value: string): value is MediaType {
  return value === "movie" || value === "tv" || value === "anime";
}

export async function generateMetadata({
  params,
}: MediaDetailsPageProps): Promise<Metadata> {
  const { mediaType, id } = await params;
  return generateMediaMetadata({ mediaType, id });
}

export default async function Page({ params }: MediaDetailsPageProps) {
  const { mediaType, id } = await params;

  if (!isMediaType(mediaType)) {
    notFound();
  }

  return (
    <MediaDetailsPageClient
      key={`${mediaType}-${id}`}
      id={id}
      mediaType={mediaType}
    />
  );
}
