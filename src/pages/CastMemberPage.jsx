import React, { useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import useFetch from "../hooks/useFetch";
import {
  fetchPersonDetails,
  fetchPersonCredits,
  getImageUrl,
} from "../services/tmdbApi";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { TvIcon } from "@heroicons/react/24/solid";
import {
  CalendarIcon,
  MapPinIcon,
  FilmIcon,
  StarIcon,
} from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/24/solid";

const ITEMS_PER_PAGE = 12;

const CastMemberPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { loadingConfig } = useAppContext();

  const {
    data: person,
    loading: personLoading,
    error: personError,
  } = useFetch(fetchPersonDetails, id);

  const {
    data: credits,
    loading: creditsLoading,
    error: creditsError,
  } = useFetch(fetchPersonCredits, id);

  // Sort credits by popularity and remove duplicates
  const sortedCredits = useMemo(() => {
    if (!credits?.cast) return [];
    const seen = new Set();
    return credits.cast
      .filter((item) => {
        if (seen.has(item.id) || !item.poster_path) return false;
        seen.add(item.id);
        return true;
      })
      .sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
  }, [credits]);

  const movieCredits = useMemo(
    () => sortedCredits.filter((item) => item.media_type === "movie"),
    [sortedCredits]
  );

  const tvCredits = useMemo(
    () => sortedCredits.filter((item) => item.media_type === "tv"),
    [sortedCredits]
  );

  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);
  const [activeTab, setActiveTab] = useState("movies");

  const activeCredits = useMemo(() => {
    if (activeTab === "movies") return movieCredits;
    if (activeTab === "tv") return tvCredits;
    return sortedCredits;
  }, [activeTab, movieCredits, tvCredits, sortedCredits]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setVisibleCount(ITEMS_PER_PAGE);
  };

  // Loading state
  if (loadingConfig || personLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-white">
        <Spinner />
        <p className="ml-4 text-xl">Loading...</p>
      </div>
    );
  }

  // Error state
  if (personError || creditsError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-red-500 text-xl p-8 text-center">
        Error: {personError?.message || creditsError?.message || "Something went wrong"}
      </div>
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg text-white text-xl">
        No details available.
      </div>
    );
  }

  const profileUrl = getImageUrl(person.profile_path, "h632");
  const age = person.birthday
    ? new Date().getFullYear() - new Date(person.birthday).getFullYear()
    : null;

  return (
    <div className="bg-brand-bg text-white min-h-screen pb-16 md:pb-8 overflow-x-hidden">
      {/* Back Button */}
      <div className="container mx-auto px-4 md:px-8 lg:px-12 fixed z-30 top-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-3 md:mb-0 inline-flex items-center space-x-1.5 text-muted-foreground hover:text-brand-yellow transition-colors text-sm sm:text-sm rounded-full px-3 py-2 bg-zinc-800/25 hover:bg-zinc-800/60 backdrop-blur-sm cursor-pointer border border-gray-800/40"
          aria-label="Go back to previous page"
        >
          <ArrowLeftIcon className="size-4 sm:size-5" />
          <span>Back</span>
        </button>
      </div>

      {/* Hero / Profile Section */}
      <div className="relative pt-20 pb-8">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-yellow/5 via-brand-bg to-brand-bg" />

        <div className="container mx-auto px-4 md:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* Profile Image */}
            <div className="flex-shrink-0 mx-auto md:mx-0">
              <div className="w-48 h-48 md:w-56 md:h-56 lg:w-64 lg:h-64 rounded-2xl overflow-hidden shadow-2xl shadow-brand-yellow/10 border-2 border-zinc-700/50 ring-2 ring-brand-yellow/20">
                <img
                  src={
                    profileUrl ||
                    "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png"
                  }
                  alt={person.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://cdn.pixabay.com/photo/2016/08/08/09/17/avatar-1577909_1280.png";
                  }}
                />
              </div>
            </div>

            {/* Person Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {person.name}
              </h1>

              {person.known_for_department && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-yellow/10 text-brand-yellow border border-brand-yellow/20 rounded-full text-sm font-medium mb-4">
                  <FilmIcon className="size-4" />
                  {person.known_for_department}
                </span>
              )}

              {/* Meta Info */}
              <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start text-sm text-gray-400">
                {person.birthday && (
                  <div className="flex items-center gap-1.5">
                    <CalendarIcon className="size-4 text-brand-yellow/70" />
                    <span>
                      {new Date(person.birthday).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                      {age && !person.deathday && (
                        <span className="text-gray-500"> ({age} yrs)</span>
                      )}
                    </span>
                  </div>
                )}
                {person.place_of_birth && (
                  <div className="flex items-center gap-1.5">
                    <MapPinIcon className="size-4 text-brand-yellow/70" />
                    <span>{person.place_of_birth}</span>
                  </div>
                )}
                {sortedCredits.length > 0 && (
                  <div className="flex items-center gap-1.5">
                    <StarIcon className="size-4 text-brand-yellow/70" />
                    <span>{sortedCredits.length} credits</span>
                  </div>
                )}
              </div>

              {/* Biography */}
              {person.biography && (
                <div className="mt-6">
                  <h2 className="text-lg font-semibold text-gray-200 mb-2">
                    Biography
                  </h2>
                  <p className="text-gray-400 leading-relaxed text-sm md:text-base line-clamp-[8] md:line-clamp-none">
                    {person.biography}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Credits Section */}
      {sortedCredits.length > 0 && (
        <section className="container mx-auto px-4 md:px-8 lg:px-12 py-6">
          {/* Tab Buttons */}
          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <h2 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              {activeTab === "tv" ? (
                <TvIcon className="size-7 text-brand-yellow" />
              ) : (
                <FilmIcon className="size-7 text-brand-yellow" />
              )}
              {activeTab === "movies" ? "Movies" : activeTab === "tv" ? "TV Shows" : "All Credits"}
              <span className="text-sm font-normal text-gray-500 ml-1">
                ({activeCredits.length})
              </span>
            </h2>
            <div className="flex gap-1 bg-zinc-900/80 p-1 rounded-lg border border-zinc-800">
              {[
                { key: "all", label: "All", count: sortedCredits.length },
                { key: "movies", label: "Movies", count: movieCredits.length },
                { key: "tv", label: "TV Shows", count: tvCredits.length },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200 cursor-pointer ${activeTab === tab.key
                      ? "bg-brand-yellow text-black"
                      : "text-gray-400 hover:text-white hover:bg-zinc-800"
                    }`}
                >
                  {tab.label}
                  <span className={`ml-1.5 text-xs ${activeTab === tab.key ? "text-black/60" : "text-gray-600"}`}>
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Credits Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {activeCredits.slice(0, visibleCount).map((item) => (
              <MovieCard
                key={`${item.media_type}-${item.id}-${item.credit_id}`}
                item={item}
                mediaType={item.media_type}
              />
            ))}
          </div>

          {/* Load More */}
          {visibleCount < activeCredits.length && (
            <div className="flex justify-center mt-8">
              <button
                onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
                className="inline-flex items-center gap-2 px-6 py-2.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 hover:border-brand-yellow/40 text-gray-200 hover:text-brand-yellow rounded-full text-sm font-medium transition-all duration-300 cursor-pointer"
              >
                Load More
                <ChevronDownIcon className="size-4" />
                <span className="text-xs text-gray-500">
                  ({Math.min(ITEMS_PER_PAGE, activeCredits.length - visibleCount)} more)
                </span>
              </button>
            </div>
          )}
        </section>
      )}

      {/* Loading credits skeleton */}
      {creditsLoading && (
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="bg-zinc-800 rounded-lg aspect-[2/3] animate-pulse"
              />
            ))}
          </div>
        </div>
      )}

      {/* No credits */}
      {!creditsLoading && sortedCredits.length === 0 && (
        <div className="container mx-auto px-4 md:px-8 lg:px-12 py-12 text-center">
          <p className="text-gray-500 text-lg">No credits found for this person.</p>
        </div>
      )}
    </div>
  );
};

export default CastMemberPage;
