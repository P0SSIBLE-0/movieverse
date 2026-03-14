
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useWatchlist } from '../context/WatchlistContext';
import { useAppContext } from '../context/AppContext';
import { BookmarkIcon, TrashIcon, FilmIcon } from '@heroicons/react/24/solid';
import { StarIcon } from '../components/icons';

const WatchlistPage = () => {
  const { watchlist, removeFromWatchlist } = useWatchlist();
  const { getImageUrl } = useAppContext();
  const [removingId, setRemovingId] = useState(null);
  const [filter, setFilter] = useState('all'); // 'all', 'movie', 'tv'

  const filteredList = filter === 'all'
    ? watchlist
    : watchlist.filter((item) => item.media_type === filter);

  const handleRemove = (id, mediaType) => {
    setRemovingId(`${id}-${mediaType}`);
    // Small delay for exit animation
    setTimeout(() => {
      removeFromWatchlist(id, mediaType);
      setRemovingId(null);
    }, 300);
  };

  const handleImageError = (e) => {
    e.target.onerror = null;
    e.target.src = 'https://placehold.co/400x600';
  };

  // Empty state
  if (watchlist.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-full bg-gradient-to-br from-brand-yellow/20 to-brand-orange/20 flex items-center justify-center">
            <BookmarkIcon className="w-14 h-14 text-brand-yellow/60" />
          </div>
          <div className="absolute -top-1 -right-1 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-brand-bg">
            <span className="text-xs font-bold text-zinc-400">0</span>
          </div>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
          Your watchlist is empty
        </h2>
        <p className="text-brand-text-secondary max-w-md mb-8 text-sm md:text-base">
          Start building your personal collection! Browse movies and TV shows,
          then tap the bookmark icon to save them here for later.
        </p>
        <div className="flex gap-3">
          <Link
            to="/explore/movie"
            className="bg-brand-yellow text-black px-6 py-2.5 rounded-lg font-semibold hover:bg-yellow-400 transition-colors text-sm"
          >
            Explore Movies
          </Link>
          <Link
            to="/explore/tv"
            className="bg-zinc-800 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-zinc-700 transition-colors text-sm"
          >
            Explore TV Shows
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24 md:pb-8">
      {/* Header */}
      <div className="px-4 md:px-8 lg:px-12 pt-6 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <BookmarkIcon className="w-7 h-7 text-brand-yellow" />
          <h1 className="text-2xl md:text-3xl font-bold text-white">
            My Watchlist
          </h1>
        </div>
        <p className="text-brand-text-secondary text-sm ml-10">
          {watchlist.length} {watchlist.length === 1 ? 'title' : 'titles'} saved
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="px-4 md:px-8 lg:px-12 mb-6">
        <div className="flex gap-2">
          {[
            { key: 'all', label: 'All' },
            { key: 'movie', label: 'Movies' },
            { key: 'tv', label: 'TV Shows' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${filter === tab.key
                ? 'bg-brand-yellow text-black'
                : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-700'
                }`}
            >
              {tab.label}
              {tab.key !== 'all' && (
                <span className="ml-1.5 text-xs opacity-70">
                  ({watchlist.filter((i) => i.media_type === tab.key).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Watchlist Grid */}
      {filteredList.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4">
          <FilmIcon className="w-12 h-12 text-zinc-600 mb-3" />
          <p className="text-zinc-500 text-sm">
            No {filter === 'movie' ? 'movies' : 'TV shows'} in your watchlist yet.
          </p>
        </div>
      ) : (
        <div className="px-4 md:px-8 lg:px-12 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-5">
          {filteredList.map((item) => {
            const isRemoving = removingId === `${item.id}-${item.media_type}`;
            return (
              <div
                key={`${item.id}-${item.media_type}`}
                className={`group relative transition-all duration-300 ${isRemoving ? 'opacity-0 scale-90' : 'opacity-100 scale-100'
                  }`}
              >
                <Link
                  to={`/${item.media_type}/${item.id}`}
                  className="block"
                >
                  <div className="relative aspect-[2/3] bg-brand-card rounded-xl overflow-hidden shadow-lg">
                    <img
                      src={getImageUrl(item.poster_path, 'w500')}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                      loading="lazy"
                    />
                    {/* Rating badge */}
                    {item.vote_average > 0 && (
                      <div className="absolute top-2 left-2 bg-brand-yellow text-black text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        <StarIcon className="w-3 h-3" />
                        <span>{item.vote_average.toFixed(1)}</span>
                      </div>
                    )}
                    {/* Media type badge */}
                    <div className="absolute top-2 right-2 bg-zinc-900/70 backdrop-blur-sm text-[10px] font-semibold px-2 py-1 rounded-full uppercase text-zinc-300 tracking-wider">
                      {item.media_type}
                    </div>
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {/* Title overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-zinc-900/90 to-transparent">
                      <h3 className="text-white text-sm font-semibold truncate">
                        {item.title}
                      </h3>
                      {item.release_date && (
                        <p className="text-zinc-400 text-xs mt-0.5">
                          {new Date(item.release_date).getFullYear()}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>

                {/* Remove button */}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemove(item.id, item.media_type);
                  }}
                  className="absolute bottom-2 right-2 size-7 rounded-full bg-red-500/70 backdrop-blur-sm hidden md:flex items-center justify-center md:opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:scale-110 z-10 cursor-pointer"
                  title="Remove from watchlist"
                >
                  <TrashIcon className="size-3.5 text-white" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default WatchlistPage;
