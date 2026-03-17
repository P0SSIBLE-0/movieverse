import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, ClockIcon, StarIcon } from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import RatingCircle from '../RatingCircle';
import MediaActions from './MediaActions';

const MediaInfo = ({
  posterPath,
  backdropPath,
  title,
  tagline,
  genres,
  mediaType,
  voteAverage,
  releaseDate,
  runtime,
  numberOfSeasons,
  overview,
  onPlayStream,
  onPlayTrailer,
  hasStreamUrl,
  onImageError,
  mediaItem,
}) => {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const hours = runtime ? Math.floor(runtime / 60) : 0;
  const mins = runtime ? runtime % 60 : 0;

  return (
    <section className="relative w-full overflow-hidden" id="media-info-section">
      {/* Backdrop Background */}
      <div className="absolute inset-0 z-0">
        {backdropPath && (
          <img
            src={backdropPath}
            alt=""
            className="w-full h-full object-cover object-center"
            aria-hidden="true"
          />
        )}
        {/* Multi-layer gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#101010] via-[#101010]/85 to-[#101010]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#101010]/90 via-[#101010]/40 to-[#101010]/50" />
        <div className="absolute inset-0 bg-[#101010]/30 backdrop-blur-sm" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 md:px-8 lg:px-12 pt-10 pb-5 md:py-16 lg:py-20">
        {/* Glassmorphism Card */}
        <div className="bg-white/[0.04] backdrop-blur-md border border-white/[0.07] rounded-lg lg:rounded-xl px-5 py-10 md:p-8 lg:p-10 shadow-2xl shadow-black/30">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 pt-8 md:pt-0">
            {/* Poster */}
            <div className="w-full md:w-[240px] lg:w-[270px] flex-shrink-0 self-start mb-4">
              <div className="relative group mx-auto md:mx-0 w-[180px] md:w-full">
                <img
                  src={posterPath}
                  alt={`${title} poster`}
                  className="w-full rounded-lg lg:rounded-2xl shadow-2xl shadow-black/50 object-cover aspect-[2/3] ring-1 ring-white/[0.08]"
                  onError={onImageError}
                />
                {/* Hover glow */}
                <div className="absolute -inset-1 bg-gradient-to-b from-amber-500/10 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-lg" />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {/* Title */}
              <h1 className="text-2xl md:text-3xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mb-1.5 md:mb-2"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {title}
              </h1>

              {/* Tagline */}
              {tagline && (
                <p className="text-sm md:text-base text-white/40 italic mb-4 md:mb-4 font-light tracking-wide">
                  "{tagline}"
                </p>
              )}

              {/* Meta Row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-4 md:mb-5 text-sm text-white/50">
                {year && (
                  <span className="flex items-center gap-1.5">
                    <CalendarDaysIcon className="w-4 h-4 text-amber-400/70" />
                    {year}
                  </span>
                )}
                {runtime > 0 && (
                  <span className="flex items-center gap-1.5">
                    <ClockIcon className="w-4 h-4 text-amber-400/70" />
                    {hours > 0 ? `${hours}h ` : ''}{mins}m
                  </span>
                )}
                {mediaType === 'tv' && numberOfSeasons && (
                  <span className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-amber-400/70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h1.5C5.496 19.5 6 19.002 6 18.375m-2.625 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-1.5A1.125 1.125 0 0118 18.375M20.625 4.5H3.375m17.25 0c.621 0 1.125.504 1.125 1.125M20.625 4.5h-1.5C18.504 4.5 18 5.004 18 5.625m3.75 0v1.5c0 .621-.504 1.125-1.125 1.125M3.375 4.5c-.621 0-1.125.504-1.125 1.125M3.375 4.5h1.5C5.496 4.5 6 5.004 6 5.625m-3.75 0v1.5c0 .621.504 1.125 1.125 1.125m0 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m1.5-3.75C5.496 8.25 6 7.746 6 7.125v-1.5M4.875 8.25C5.496 8.25 6 8.754 6 9.375v1.5m0-5.25v5.25m0-5.25C6 5.004 6.504 4.5 7.125 4.5h9.75c.621 0 1.125.504 1.125 1.125m1.125 2.625h1.5m-1.5 0A1.125 1.125 0 0118 7.125v-1.5m1.125 2.625c-.621 0-1.125.504-1.125 1.125v1.5m2.625-2.625c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125M18 5.625v5.25M7.125 12h9.75m-9.75 0A1.125 1.125 0 016 10.875M7.125 12C6.504 12 6 12.504 6 13.125m0-2.25c0 .621.504 1.125 1.125 1.125M18 10.875c0 .621-.504 1.125-1.125 1.125M18 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m-12 5.25v-5.25m0 5.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125m-12 0v-1.5c0-.621-.504-1.125-1.125-1.125M18 18.375v-5.25m0 5.25v-1.5c0-.621.504-1.125 1.125-1.125M18 13.125v1.5c0 .621.504 1.125 1.125 1.125M18 13.125c0-.621.504-1.125 1.125-1.125M6 13.125v1.5c0 .621-.504 1.125-1.125 1.125M6 13.125C6 12.504 5.496 12 4.875 12m-1.5 0h1.5m-1.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M19.125 12h1.5m0 0c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h1.5m14.25 0h1.5" />
                    </svg>
                    {numberOfSeasons} Season{numberOfSeasons > 1 ? 's' : ''}
                  </span>
                )}
                {voteAverage > 0 && (
                  <span className="flex items-center gap-1">
                    <StarSolidIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-amber-400 font-semibold">{voteAverage.toFixed(1)}</span>
                    <span className="text-white/30">/10</span>
                  </span>
                )}
              </div>

              {/* Genres */}
              <div className="flex flex-wrap items-center gap-2 mb-5 md:mb-6">
                {genres?.map((genre) => (
                  <Link
                    key={genre.id}
                    to={`/explore/${mediaType}?genre=${genre.id}`}
                    className="px-3 py-1 text-xs md:text-sm font-medium rounded-full bg-white/[0.06] border border-white/[0.08] text-white/60 hover:bg-amber-500/15 hover:text-amber-400 hover:border-amber-500/30 transition-all duration-300"
                  >
                    {genre.name}
                  </Link>
                ))}
              </div>

              {/* Overview */}
              {overview && (
                <div className="mb-6 md:mb-8">
                  <h3 className="text-xs uppercase tracking-[0.15em] text-white/30 font-semibold mb-2.5">
                    Synopsis
                  </h3>
                  <p className="text-sm md:text-base text-white/60 leading-relaxed max-w-2xl line-clamp-5 md:line-clamp-none">
                    {overview}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <MediaActions
                onPlayStream={onPlayStream}
                onPlayTrailer={onPlayTrailer}
                hasStreamUrl={hasStreamUrl}
                mediaItem={mediaItem}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaInfo;