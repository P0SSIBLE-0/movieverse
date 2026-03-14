import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/AppContext';
import { useWatchlist } from '../context/WatchlistContext';
import { StarIcon } from './icons';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';

const MovieCard = ({ item, mediaType }) => {
  const { getImageUrl } = useAppContext();
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [justToggled, setJustToggled] = useState(false);
  const type = mediaType || item.media_type; // item.media_type comes from trending/multi-search

  if (!item) return null;

  const inWatchlist = isInWatchlist(item.id, type);

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/400x600';
  };

  const handleBookmarkClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWatchlist({ ...item, media_type: type });
    setJustToggled(true);
    setTimeout(() => setJustToggled(false), 500);
  };

  return (
    <Link to={`/${type}/${item.id}`} className="block group">
      <div className="relative aspect-[2/3] bg-brand-card rounded-lg overflow-hidden shadow-lg transform transition-all duration-300">
        <img
          src={getImageUrl(item.poster_path, 'w500')}
          alt={item.title || item.name}
          className="w-full h-full object-cover group-hover:scale-105 duration-300"
          onError={handleImageError}
          loading="lazy"
        />
        {item.vote_average > 0 && (
          <div className="absolute top-2 right-2 bg-brand-yellow text-black text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
            <StarIcon className="size-3" />
            <span>{item.vote_average.toFixed(1)}</span>
          </div>
        )}
        {/* Bookmark / Watchlist button */}
        <button
          onClick={handleBookmarkClick}
          className={`absolute top-0 left-0 size-10 rounded-full flex items-center justify-center transition-all duration-300 z-10 cursor-pointer ${inWatchlist
            ? 'bg-transparent text-yellow-500 scale-100'
            : 'bg-black/50 backdrop-blur-sm text-white opacity-0 group-hover:opacity-100 hover:bg-black/70'
            } ${justToggled ? 'scale-125' : ''}`}
          title={inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'}
        >
          {inWatchlist ? (
            <BookmarkSolidIcon className="size-5" />
          ) : (
            <BookmarkIcon className="size-5" />
          )}
        </button>
        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-2 py-3 bg-gradient-to-t from-zinc-900/90 to-transparent">
          <h3 className="text-white text-sm font-semibold truncate group-hover:whitespace-normal group-hover:line-clamp-2">
            {item.title || item.name}
          </h3>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
