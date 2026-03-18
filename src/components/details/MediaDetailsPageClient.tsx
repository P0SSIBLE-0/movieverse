"use client";

import type { SyntheticEvent } from "react";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import VideoPlayerModal from "@/components/VideoPlayerModal";
import MediaInfo from "@/components/details/MediaInfo";
import StreamPlayer from "@/components/details/StreamPlayer";
import CastSection from "@/components/details/CastSection";
import VideosSection from "@/components/details/VideosSection";
import RecommendationsSection from "@/components/details/RecommendationsSection";
import MediaDetailsSkeleton from "@/components/details/MediaDetailsSkeleton";
import MediaDetailsErrorState from "@/components/details/MediaDetailsErrorState";
import { useAppContext } from "@/context/AppContext";
import useFetch from "@/hooks/useFetch";
import { STREAMING_PROVIDERS } from "@/services/streamingApi";
import { fetchDetails, getImageUrl } from "@/services/tmdbApi";
import type { MediaDetails, MediaType, WatchlistSourceItem } from "@/types";

type MediaDetailsPageClientProps = {
  id: string;
  mediaType: MediaType;
};

export default function MediaDetailsPageClient({
  id,
  mediaType,
}: MediaDetailsPageClientProps) {
  const router = useRouter();
  const { loadingConfig } = useAppContext();
  const [selectedVideoKey, setSelectedVideoKey] = useState<string | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(
    STREAMING_PROVIDERS[0]?.id || ""
  );
  const [streamError, setStreamError] = useState<string | null>(null);
  const [retryKey, setRetryKey] = useState(0);
  const type = mediaType === "anime" ? "tv" : mediaType;
  const {
    data: details,
    loading: detailsLoading,
    error: detailsError,
  } = useFetch<MediaDetails, [string, string]>(fetchDetails, type, id);

  const itemDetails = useMemo(() => {
    if (!details) {
      return null;
    }

    return {
      computedTitle: details.title || details.name || "Untitled",
      computedReleaseDate: details.release_date || details.first_air_date,
      computedRuntime: details.runtime || details.episode_run_time?.[0] || 0,
      ...details,
    };
  }, [details]);

  const streamEmbedUrl = useMemo(() => {
    const provider =
      STREAMING_PROVIDERS.find((item) => item.id === selectedProvider) ||
      STREAMING_PROVIDERS[0];

    if (!provider) {
      return null;
    }

    if (type === "movie" && id) {
      return provider.getMovieUrl(id);
    }

    if (type === "tv" && id && selectedSeason > 0 && selectedEpisode > 0) {
      return provider.getTvUrl(id, selectedSeason, selectedEpisode);
    }

    return null;
  }, [id, selectedEpisode, selectedProvider, selectedSeason, type]);

  const episodesForSelectedSeason = useMemo(() => {
    if (type !== "tv" || !itemDetails?.seasons?.length) {
      return [];
    }

    const season = itemDetails.seasons.find(
      (item) => item.season_number === selectedSeason
    );

    return season?.episode_count
      ? Array.from({ length: season.episode_count }, (_, index) => index + 1)
      : [];
  }, [itemDetails, selectedSeason, type]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id, type]);

  const handleImageError = (
    event: SyntheticEvent<HTMLImageElement>,
    fallbackSrc: string | null
  ) => {
    event.currentTarget.onerror = null;

    if (fallbackSrc) {
      event.currentTarget.src = fallbackSrc;
    }
  };

  const playTrailer = (key: string) => {
    setSelectedVideoKey(key);
    setShowVideoModal(true);
  };

  const handleProviderChange = (providerId: string) => {
    setSelectedProvider(providerId);
    setStreamError(null);
    setRetryKey((currentRetryKey) => currentRetryKey + 1);
  };

  if (loadingConfig || detailsLoading) {
    return <MediaDetailsSkeleton />;
  }

  if (detailsError) {
    return (
      <MediaDetailsErrorState
        title="Unable to load the details"
        description={detailsError}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!itemDetails) {
    return (
      <MediaDetailsErrorState
        title="No details available"
        description="We couldn't find data for this title right now. Please try again in a moment."
        onRetry={() => window.location.reload()}
      />
    );
  }

  const {
    computedTitle: itemTitle,
    backdrop_path,
    poster_path,
    overview,
    genres = [],
    computedReleaseDate: itemReleaseDate,
    vote_average = 0,
    tagline,
    computedRuntime: itemRuntime,
    number_of_seasons,
    seasons = [],
    videos = { results: [] },
    credits = { cast: [] },
    recommendations = { results: [] },
  } = itemDetails;

  const officialTrailers =
    videos.results
      ?.filter(
        (video) =>
          video.site === "YouTube" &&
          (video.type === "Trailer" || video.type === "Teaser")
      )
      .slice(0, 10) || [];

  const topCast = credits.cast?.slice(0, 15) || [];
  const similarItems =
    recommendations.results?.filter((item) => item.poster_path).slice(0, 15) ||
    [];

  return (
    <div className="bg-[#050505] text-[#e5e5e5] min-h-screen pb-16 md:pb-8 font-sans selection:bg-white/10">
      <header className="w-full px-4 md:px-8 py-6 max-w-[1400px] mx-auto flex items-center relative">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-white/40 bg-black/40  px-3 py-2 rounded-full border border-black/20 backdrop-blur-md hover:text-white text-sm font-medium tracking-wide transition-all duration-300 cursor-pointer"
          aria-label="Go back to previous page"
        >
          <ArrowLeftIcon className="size-4" />
          <span>BACK</span>
        </button>
      </header>

      <div className="max-w-[1400px] mx-auto px-2 md:px-8">
        <div className="mb-10">
          <MediaInfo
            posterPath={getImageUrl(poster_path, "w500")}
            backdropPath={getImageUrl(backdrop_path, "original")}
            title={itemTitle}
            tagline={tagline}
            genres={genres}
            mediaType={mediaType}
            voteAverage={vote_average}
            releaseDate={itemReleaseDate}
            runtime={itemRuntime}
            numberOfSeasons={number_of_seasons}
            overview={overview}
            onPlayTrailer={
              officialTrailers[0]
                ? () => playTrailer(officialTrailers[0].key)
                : null
            }
            onImageError={(event) =>
              handleImageError(event, getImageUrl(null, "w500"))
            }
            mediaItem={{
              id: Number(id),
              media_type: mediaType,
              title: itemDetails.title,
              name: itemDetails.name,
              poster_path,
              vote_average,
              release_date: itemDetails.release_date,
              first_air_date: itemDetails.first_air_date,
              overview,
            } as WatchlistSourceItem}
          />
        </div>

        {streamEmbedUrl && (
          <div className="w-full mb-5 md:mb-15 mt-2">
            {streamError && (
              <div className="container mx-auto px-4 md:px-8">
                <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-3 flex justify-between items-center text-sm mb-2">
                  <span>{streamError}</span>
                  <button
                    onClick={() => {
                      setStreamError(null);
                      setRetryKey((currentRetryKey) => currentRetryKey + 1);
                    }}
                    className="ml-4 px-3 py-1 bg-red-500/20 hover:bg-red-500/30 rounded-lg text-sm transition-colors cursor-pointer"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            <StreamPlayer
              key={`${streamEmbedUrl}-${retryKey}`}
              id={id}
              mediaType={mediaType}
              title={itemTitle}
              streamEmbedUrl={streamEmbedUrl}
              seasons={seasons}
              selectedSeason={selectedSeason}
              selectedEpisode={selectedEpisode}
              onSeasonChange={(season) => {
                setSelectedSeason(season);
                setSelectedEpisode(1);
              }}
              onEpisodeChange={setSelectedEpisode}
              episodesForSelectedSeason={episodesForSelectedSeason}
              onError={(error) => {
                console.error("Stream error:", error);
                setStreamError(
                  `Failed to load stream from ${STREAMING_PROVIDERS.find(
                    (provider) => provider.id === selectedProvider
                  )?.name || "provider"
                  }. Trying another source...`
                );

                const currentIndex = STREAMING_PROVIDERS.findIndex(
                  (provider) => provider.id === selectedProvider
                );

                if (currentIndex < STREAMING_PROVIDERS.length - 1) {
                  setSelectedProvider(STREAMING_PROVIDERS[currentIndex + 1].id);
                }
              }}
              selectedProvider={selectedProvider}
              onProviderChange={handleProviderChange}
            />
          </div>
        )}

        {topCast.length > 0 && <CastSection cast={topCast} />}

        {officialTrailers.length > 0 && (
          <VideosSection videos={officialTrailers} onVideoSelect={playTrailer} />
        )}

        {similarItems.length > 0 && (
          <RecommendationsSection
            items={similarItems}
            mediaType={mediaType}
            title={mediaType === "movie" ? "Similar Movies" : "Similar Shows"}
          />
        )}
      </div>

      <VideoPlayerModal
        videoKey={selectedVideoKey}
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />
    </div>
  );
}
