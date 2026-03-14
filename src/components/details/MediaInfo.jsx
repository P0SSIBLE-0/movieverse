// MediaInfo.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDaysIcon, ClockIcon } from '@heroicons/react/24/outline';
import RatingCircle from '../RatingCircle';
import MediaActions from './MediaActions';

const MediaInfo = ({ 
  posterPath, 
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
  mediaItem
}) => {
  return (
    <div className="flex flex-col md:flex-row gap-6 md:gap-10">
      <div className="w-full md:w-1/3 lg:w-1/4 flex-shrink-0">
        <img
          src={posterPath}
          alt={`${title} poster`}
          className="rounded-xl shadow-2xl w-[60%] md:w-full mx-auto md:mx-0 object-cover aspect-[2/3]"
          onError={onImageError}
        />
      </div>

      <div className="md:w-2/3 lg:w-3/4 pt-0 md:pt-2 mt-4 lg:mt-0 md:mt-0">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-1 md:mb-2">
          {title}
        </h1>
        {tagline && (
          <p className="text-md md:text-lg text-brand-text-secondary italic mb-3 md:mb-4">
            {tagline}
          </p>
        )}

        <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-5">
          {genres?.map((genre) => (
            <Link
              key={genre.id}
              to={`/explore/${mediaType}?genre=${genre.id}`}
              className="bg-zinc-700 text-xs md:text-sm px-3 py-1 rounded-full hover:bg-brand-yellow hover:text-black transition-colors"
            >
              {genre.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center space-x-4 md:space-x-6 mb-4 md:mb-6">
          {voteAverage > 0 && <RatingCircle rating={voteAverage} size={60} />}
          <div className="flex flex-col space-y-1">
            {releaseDate && (
              <span className="text-sm text-brand-text-secondary flex items-center">
                <CalendarDaysIcon className="w-4 h-4 mr-1.5" />
                {new Date(releaseDate).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            )}
            {runtime != null && (
              <span className="text-sm text-brand-text-secondary flex items-center">
                <ClockIcon className="w-4 h-4 mr-1.5" /> {runtime} min
                {mediaType === "tv" &&
                  numberOfSeasons &&
                  ` • ${numberOfSeasons} Season${
                    numberOfSeasons > 1 ? "s" : ""
                  }`}
              </span>
            )}
          </div>
        </div>

        {overview && (
          <>
            <h3 className="text-xl font-semibold mb-2">Overview</h3>
            <p className="text-sm md:text-base text-brand-text-secondary leading-relaxed mb-6 md:mb-8">
              {overview}
            </p>
          </>
        )}
        <MediaActions
          onPlayStream={onPlayStream}
          onPlayTrailer={onPlayTrailer}
          hasStreamUrl={hasStreamUrl}
          mediaItem={mediaItem}
        />
      </div>
    </div>
  );
};

export default MediaInfo;