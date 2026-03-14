// src/components/HeroBanner/HeroBanner.jsx
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";

import { useAppContext } from "../context/AppContext";
import { useWatchlist } from "../context/WatchlistContext";
import { fetchTrending } from "../services/tmdbApi";
import { PlayIcon, StarIcon } from "../components/icons";
import { Link } from "react-router-dom";
import { BookmarkIcon } from "@heroicons/react/24/outline";
import { BookmarkIcon as BookmarkSolidIcon } from "@heroicons/react/24/solid";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";

function HeroBanner() {
  const [heroSlides, setHeroSlides] = useState([]);
  const [loading, setLoading] = useState(true);
  const { getImageUrl, loadingConfig } = useAppContext();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  useEffect(() => {
    if (loadingConfig) return; // Wait for API config

    fetchTrending("movie", "week") // Fetch weekly trending movies for hero
      .then((res) => {
        // Take top 5 for hero banner
        setHeroSlides(res.data.results.slice(0, 5));
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch hero slides:", err);
        setLoading(false);
      });
  }, [loadingConfig]);

  if (loading || loadingConfig) {
    return (
      <div className="h-[50vh] md:h-[70vh] bg-zinc-800 animate-pulse flex items-center justify-center">
        <p></p>
      </div>
    );
  }

  if (!heroSlides.length) {
    return (
      <div className="h-[50vh] md:h-[70vh] flex items-center justify-center">
        <p className="text-white text-xl font-semibold">No hero content available.</p>
      </div>
    );
  }

  return (
    <div className="relative h-[50vh] md:h-[70vh] w-full">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        scrollbar={{ draggable: true }}
        pagination={false}
        navigation={{
          nextEl: ".swiper-button-next-hero",
          prevEl: ".swiper-button-prev-hero",
        }}
        effect="fade"
        className="h-full w-full"
      >
        {heroSlides.map((slide) => (
          <SwiperSlide key={slide.id} className="relative">
            <img
              src={getImageUrl(slide.backdrop_path, "original")}
              alt={slide.title || slide.name}
              className="w-full h-full object-cover"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-bg via-brand-bg/70 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-brand-bg via-brand-bg/30 to-transparent md:w-2/3"></div>

            <div className="absolute bottom-0 left-0 p-4 md:p-8 lg:p-12 text-white w-full md:w-2/3 lg:w-1/2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3">
                {slide.title || slide.name}
              </h1>
              <div className="flex items-center space-x-4 mb-2 md:mb-4 text-sm md:text-base text-brand-text-secondary">
                <span>{slide.media_type?.toUpperCase() || "MOVIE"}</span>
                <span>
                  {new Date(
                    slide.release_date || slide.first_air_date
                  ).getFullYear()}
                </span>
                <span className="flex items-center">
                  <StarIcon className="w-4 h-4 text-brand-yellow mr-1" />
                  {slide.vote_average?.toFixed(1)}
                </span>
              </div>
              <p className="text-xs md:text-sm mb-4 md:mb-6 line-clamp-2 md:line-clamp-3 text-brand-text-secondary">
                {slide.overview}
              </p>
              <div className="flex items-center space-x-3">
                <Link
                  to={`/${slide.media_type || "movie"}/${slide.id}`}
                  className="bg-white/30 backdrop-blur-sm text-white px-4 py-2 md:px-6 md:py-2.5 rounded-full font-semibold flex items-center space-x-2 hover:bg-opacity-90 transition-colors text-sm md:text-base "
                >
                  <PlayIcon className="w-5 h-5" />
                  <span>Watch</span>
                </Link>
                <button
                  className={`backdrop-blur-sm px-4 py-2 md:py-3 rounded-full font-semibold flex items-center space-x-2 transition-all duration-300 text-sm md:text-base cursor-pointer  ${isInWatchlist(slide.id, slide.media_type || 'movie')
                    ? 'bg-brand-yellow/25 text-brand-yellow  hover:bg-brand-yellow/35'
                    : 'bg-white/20 text-white hover:bg-white/30'
                    }`}
                  onClick={() =>
                    toggleWatchlist({
                      ...slide,
                      media_type: slide.media_type || 'movie',
                    })
                  }
                >
                  {isInWatchlist(slide.id, slide.media_type || 'movie') ? (
                    <BookmarkSolidIcon className="w-5 h-5" />
                  ) : (
                    <BookmarkIcon className="w-5 h-5" />
                  )}
                  <span className="hidden md:block">
                    {isInWatchlist(slide.id, slide.media_type || 'movie')
                      ? 'In Watchlist'
                      : 'Watchlist'}
                  </span>
                </button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <div className="swiper-pagination absolute bottom-12 right-2 space-x-2 hidden md:block lg:block">
        <button
          className="swiper-button-prev-hero  rounded-full p-2 cursor-pointer"
          aria-label="Previous cast"
        >
          <ChevronLeftIcon className="w-6 h-6 text-brand-text-secondary hover:text-brand-yellow transition-colors" />
        </button>
        <button
          className="swiper-button-next-hero  rounded-full p-2 cursor-pointer"
          aria-label="Next cast"
        >
          <ChevronRightIcon className="w-6 h-6 text-brand-text-secondary hover:text-brand-yellow transition-colors" />
        </button>
      </div>
    </div>
  );
}

export default HeroBanner;
