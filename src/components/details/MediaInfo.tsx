import React from 'react';
import { Link } from '@/lib/react-router-dom';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
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
  onPlayTrailer,
  onImageError,
  mediaItem,
}) => {
  const year = releaseDate ? new Date(releaseDate).getFullYear() : null;
  const hours = runtime ? Math.floor(runtime / 60) : 0;
  const mins = runtime ? runtime % 60 : 0;

  return (
    <section className="relative w-full px-2 md:px-8" id="media-info-section">
      {/* Backdrop */}
      <div className="absolute top-[-100px] left-0 w-[100vw] ml-[calc(-50vw+50%)] h-[80vh] z-0 overflow-hidden opacity-20 pointer-events-none">
        {backdropPath && (
          <img
            src={backdropPath}
            alt=""
            className="w-full h-full object-cover blur-sm"
            aria-hidden="true"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/40 to-[#050505bd]" />
      </div>

      {/* Content — Grid layout */}
      <div className="relative z-10 pt-4 pb-5">
        <div className="flex flex-col items-center md:flex-row gap-8 lg:gap-16 md:items-start">
          {/* Poster */}
          <div className="w-[180px] max-w-[200px] md:max-w-none md:w-[260px] lg:w-[300px] flex-shrink-0">
            <img
              src={posterPath}
              alt={`${title} poster`}
              className="w-full rounded-sm shadow-xl object-cover aspect-[2/3] ring-1 ring-white/5"
              onError={onImageError}
            />
          </div>

          {/* Text Info */}
          <div className="flex-1 mt-6 md:mt-0 w-full max-w-4xl flex flex-col items-center md:items-start text-center md:text-left">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tighter leading-[1.1] mb-2 md:mb-3 uppercase">
              {title}
            </h1>

            {/* Tagline */}
            {tagline && (
              <p className="text-lg md:text-2xl text-white/40 font-light tracking-wide mb-6">
                {tagline}
              </p>
            )}

            {/* Minimal Metadata Row */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 sm:gap-4 md:gap-6 mb-5 text-[10px] sm:text-xs md:text-sm text-white/50 font-bold uppercase tracking-widest">
              {year && <span>{year}</span>}
              {runtime > 0 && (
                <span>
                  {hours > 0 ? `${hours}H ` : ''}{mins}M
                </span>
              )}
              {mediaType === 'tv' && numberOfSeasons && (
                <span>
                  {numberOfSeasons} SEASON{numberOfSeasons > 1 ? 'S' : ''}
                </span>
              )}
              {voteAverage > 0 && (
                <span className="flex items-center gap-1.5 text-amber-500">
                  <StarSolidIcon className="w-4 h-4" />
                  {voteAverage.toFixed(1)}
                </span>
              )}
            </div>

            {/* Overview */}
            {overview && (
              <div className="mb-6 max-w-3xl">
                <p className="text-base md:text-lg text-white/60 leading-relaxed font-light">
                  {overview}
                </p>
              </div>
            )}

            {/* Glass Pill Tags */}
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-8 text-[11px] md:text-sm font-medium">
              {genres?.map((genre) => (
                <Link
                  key={genre.id}
                  to={`/explore/${mediaType}?genre=${genre.id}`}
                  className="px-4 py-1.5 rounded-full bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] hover:border-white/[0.15] backdrop-blur-md text-white/60 hover:text-white/90 transition-all duration-300"
                >
                  {genre.name}
                </Link>
              ))}
            </div>

            {/* Actions */}
            <MediaActions
              onPlayTrailer={onPlayTrailer}
              mediaItem={mediaItem}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default MediaInfo;
