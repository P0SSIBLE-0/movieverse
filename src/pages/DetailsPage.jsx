import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import useFetch from "../hooks/useFetch";
import { fetchDetails, getImageUrl } from "../services/tmdbApi";
import VideoPlayerModal from "../components/VideoPlayerModal";
import Spinner from "../components/Spinner";
import MediaInfo from "../components/details/MediaInfo";
import StreamPlayer from "../components/details/StreamPlayer";
import CastSection from "../components/details/CastSection";
import VideosSection from "../components/details/VideosSection";
import RecommendationsSection from "../components/details/RecommendationsSection";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { STREAMING_PROVIDERS } from "../services/streamingApi";

const DetailsPage = () => {
  const { mediaType, id } = useParams();
  const navigate = useNavigate();
  const { loadingConfig } = useAppContext();
  const [selectedVideoKey, setSelectedVideoKey] = useState(null);
  const [showVideoModal, setShowVideoModal] = useState(true);
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);
  const [selectedProvider, setSelectedProvider] = useState(
    STREAMING_PROVIDERS[0]?.id || ""
  );
  const [streamError, setStreamError] = useState(null);
  const [retryKey, setRetryKey] = useState(0);
  const [showStreamPlayer, setShowStreamPlayer] = useState(false);
  const type = mediaType === "anime" ? "tv" : mediaType;
  const {
    data: details,
    loading: detailsLoading,
    error: detailsError,
  } = useFetch(fetchDetails, type, id);

  // Process item details
  const itemDetails = useMemo(() => {
    if (!details) return null;
    return {
      computedTitle: details.title || details.name,
      computedReleaseDate: details.release_date || details.first_air_date,
      computedRuntime: details.runtime || details.episode_run_time?.[0] || 0,
      ...details,
    };
  }, [details]);

  // Handle image errors
  const handleImageError = (e, fallbackSrc) => {
    e.target.onerror = null;
    if (fallbackSrc) {
      e.target.src = fallbackSrc;
    }
  };

  // Handle stream URL
  const streamEmbedUrl = useMemo(() => {
    const provider =
      STREAMING_PROVIDERS.find((p) => p.id === selectedProvider) ||
      STREAMING_PROVIDERS[0];
    if (!provider) return null;

    if (type === "movie" && id) {
      return provider.getMovieUrl(id);
    } else if (
      type === "tv" &&
      id &&
      selectedSeason > 0 &&
      selectedEpisode > 0
    ) {
      return provider.getTvUrl(id, selectedSeason, selectedEpisode);
    }
    return null;
  }, [type, id, selectedSeason, selectedEpisode, selectedProvider]);

  // Handle episodes for selected season
  const episodesForSelectedSeason = useMemo(() => {
    if (type === "tv" && itemDetails?.seasons?.length) {
      const season = itemDetails.seasons.find(
        (s) => s.season_number === selectedSeason
      );
      return season?.episode_count
        ? Array.from({ length: season.episode_count }, (_, i) => i + 1)
        : [];
    }
    return [];
  }, [type, itemDetails, selectedSeason]);

  // Reset state when mediaType or id changes
  useEffect(() => {
    window.scrollTo(0, 0);
    setShowStreamPlayer(false);
    setSelectedSeason(1);
    setSelectedEpisode(1);
  }, [type, id]);

  // Navigation handlers
  const handleGoBack = () => navigate(-1);

  const playTrailer = (key) => {
    setSelectedVideoKey(key);
    setShowVideoModal(true);
  };

  const handlePlayStream = () => {
    if (
      (type === "movie" && id) ||
      (type === "tv" && id && selectedSeason > 0 && selectedEpisode > 0)
    ) {
      setShowStreamPlayer(true);
      // Scroll to player after render
      setTimeout(() => {
        document.getElementById('stream-player-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  };

  const handleProviderChange = (providerId) => {
    setSelectedProvider(providerId);
    setStreamError(null);
    setRetryKey((prev) => prev + 1);
  };

  // Loading and error states
  if (loadingConfig || detailsLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#101010] text-white gap-4">
        <Spinner />
        <p className="text-sm text-white/40 tracking-wide">Loading details…</p>
      </div>
    );
  }

  if (detailsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101010] text-red-400 text-lg p-8 text-center">
        Error loading details: {detailsError.message}
      </div>
    );
  }

  if (!itemDetails) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#101010] text-white/50 text-lg">
        No details available to display.
      </div>
    );
  }

  // Destructure item details
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

  // Process videos and recommendations
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
    <div className="bg-[#101010] text-white min-h-screen pb-16 md:pb-8 overflow-x-hidden">
      {/* Back Button — Fixed */}
      <div className="fixed z-50 top-4 left-4 md:left-8">
        <button
          onClick={handleGoBack}
          className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm rounded-xl px-3.5 py-2.5 bg-black/40 hover:bg-black/60 backdrop-blur-md border border-white/[0.06] hover:border-white/[0.12] transition-all duration-300 cursor-pointer"
          aria-label="Go back to previous page"
        >
          <ArrowLeftIcon className="size-4" />
          <span>Back</span>
        </button>
      </div>

      {/* ─── Section 1: Stream Player ─── */}
      {showStreamPlayer && streamEmbedUrl && (
        <div className="pt-0">
          {/* Error Message */}
          {streamError && (
            <div className="container mx-auto px-4 md:px-8">
              <div className="bg-red-500/10 border border-red-500/20 text-red-300 rounded-xl p-3 flex justify-between items-center text-sm mb-2">
                <span>{streamError}</span>
                <button
                  onClick={() => {
                    setStreamError(null);
                    setRetryKey((prev) => prev + 1);
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
            onClose={() => {
              setShowStreamPlayer(false);
              setStreamError(null);
            }}
            onError={(error) => {
              console.error("Stream error:", error);
              setStreamError(
                `Failed to load stream from ${STREAMING_PROVIDERS.find((p) => p.id === selectedProvider)
                  ?.name || "provider"
                }. Trying another source...`
              );
              // Auto-switch to next provider on error
              const currentIndex = STREAMING_PROVIDERS.findIndex(
                (p) => p.id === selectedProvider
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

      {/* ─── Section 2: Movie Info ─── */}
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
        onPlayStream={handlePlayStream}
        onPlayTrailer={
          officialTrailers[0]
            ? () => playTrailer(officialTrailers[0].key)
            : null
        }
        hasStreamUrl={!!streamEmbedUrl}
        onImageError={(e) => handleImageError(e, getImageUrl(null, "w500"))}
        mediaItem={{
          id: Number(id),
          media_type: mediaType,
          title: itemDetails?.title,
          name: itemDetails?.name,
          poster_path,
          vote_average,
          release_date: itemDetails?.release_date,
          first_air_date: itemDetails?.first_air_date,
          overview,
        }}
      />

      {/* ─── Section 3: Top Cast ─── */}
      {topCast.length > 0 && <CastSection cast={topCast} />}

      {/* ─── Videos Section (only when player is hidden) ─── */}
      {!showStreamPlayer && officialTrailers.length > 0 && (
        <VideosSection videos={officialTrailers} onVideoSelect={playTrailer} />
      )}

      {/* ─── Section 4: Similar Movies ─── */}
      {similarItems.length > 0 && (
        <RecommendationsSection
          items={similarItems}
          mediaType={mediaType}
          title={mediaType === "movie" ? "Similar Movies" : "Similar Shows"}
        />
      )}

      <VideoPlayerModal
        videoKey={selectedVideoKey}
        isOpen={showVideoModal}
        onClose={() => setShowVideoModal(false)}
      />
    </div>
  );
};

export default DetailsPage;
