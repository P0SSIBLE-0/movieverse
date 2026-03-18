import type { Metadata } from "next";
import type { MediaDetails, MediaType } from "@/types";

const APP_NAME = "MovieVerse";
const DEFAULT_DESCRIPTION =
  "Browse trending movies and shows, explore cast details, and manage your watchlist.";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";
const TMDB_API_KEY =
  process.env.TMDB_API_KEY || process.env.NEXT_PUBLIC_TMDB_API_KEY;

function isMediaType(value: string): value is MediaType {
  return value === "movie" || value === "tv" || value === "anime";
}

function getApiMediaType(mediaType: MediaType) {
  return mediaType === "anime" ? "tv" : mediaType;
}

function getContentTypeLabel(mediaType: MediaType) {
  if (mediaType === "movie") {
    return "Movie";
  }

  if (mediaType === "anime") {
    return "Anime";
  }

  return "TV Show";
}

function getMediaTitle(details: MediaDetails) {
  return details.title || details.name || "Untitled";
}

function getReleaseYear(details: MediaDetails) {
  const releaseDate = details.release_date || details.first_air_date;

  return releaseDate ? new Date(releaseDate).getFullYear() : null;
}

function truncateText(text: string, maxLength: number) {
  if (text.length <= maxLength) {
    return text;
  }

  return `${text.slice(0, maxLength - 1).trimEnd()}...`;
}

function getMetadataDescription(details: MediaDetails, mediaType: MediaType) {
  const overview = details.overview?.trim();

  if (overview) {
    return truncateText(overview, 160);
  }

  const title = getMediaTitle(details);
  return `${title} ${getContentTypeLabel(
    mediaType
  ).toLowerCase()} details on ${APP_NAME}.`;
}

function getMetadataImage(details: MediaDetails) {
  if (details.backdrop_path) {
    return `${TMDB_IMAGE_BASE_URL}/original${details.backdrop_path}`;
  }

  if (details.poster_path) {
    return `${TMDB_IMAGE_BASE_URL}/w780${details.poster_path}`;
  }

  return "/open-graph.png";
}

function getFallbackMetadata(mediaType: MediaType, id: string): Metadata {
  const typeLabel = getContentTypeLabel(mediaType);
  const title = `${typeLabel} | ${APP_NAME}`;

  return {
    title,
    description: DEFAULT_DESCRIPTION,
    openGraph: {
      title,
      description: DEFAULT_DESCRIPTION,
      type: "website",
      url: `/${mediaType}/${id}`,
      images: [
        {
          url: "/open-graph.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: DEFAULT_DESCRIPTION,
      images: ["/open-graph.png"],
    },
  };
}

export async function fetchMediaDetailsForMetadata(
  mediaType: MediaType,
  id: string
) {
  if (!TMDB_API_KEY) {
    return null;
  }

  const searchParams = new URLSearchParams({
    api_key: TMDB_API_KEY,
  });

  const response = await fetch(
    `${TMDB_BASE_URL}/${getApiMediaType(mediaType)}/${id}?${searchParams.toString()}`,
    {
      next: {
        revalidate: 3600,
      },
    }
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as MediaDetails;
}

export async function generateMediaMetadata(input: {
  mediaType: string;
  id: string;
}): Promise<Metadata> {
  if (!isMediaType(input.mediaType)) {
    return {
      title: APP_NAME,
      description: DEFAULT_DESCRIPTION,
    };
  }

  const { mediaType, id } = input;
  const details = await fetchMediaDetailsForMetadata(mediaType, id);

  if (!details) {
    return getFallbackMetadata(mediaType, id);
  }

  const title = getMediaTitle(details);
  const releaseYear = getReleaseYear(details);
  const metadataTitle = `${title}${releaseYear ? ` (${releaseYear})` : ""} | ${APP_NAME}`;
  const description = getMetadataDescription(details, mediaType);
  const image = getMetadataImage(details);
  const imageAlt = `${title} poster`;

  return {
    title: metadataTitle,
    description,
    openGraph: {
      title: metadataTitle,
      description,
      type: "website",
      url: `/${mediaType}/${id}`,
      images: [
        {
          url: image,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metadataTitle,
      description,
      images: [image],
    },
  };
}
