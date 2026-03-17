import React, { useState } from 'react';
import { PlayIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon, PlayIcon as PlaySolidIcon } from '@heroicons/react/24/solid';
import { useWatchlist } from '../../context/WatchlistContext';

const MediaActions = ({ onPlayStream, onPlayTrailer, hasStreamUrl, mediaItem }) => {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();
  const [justToggled, setJustToggled] = useState(false);

  const inWatchlist = mediaItem
    ? isInWatchlist(mediaItem.id, mediaItem.media_type)
    : false;

  const handleToggleWatchlist = () => {
    if (!mediaItem) return;
    toggleWatchlist(mediaItem);
    setJustToggled(true);
    setTimeout(() => setJustToggled(false), 600);
  };

  return (
    <div className="flex items-center flex-wrap gap-3">
      {/* Watch Now — Primary CTA */}
      <button
        onClick={onPlayStream}
        className="group relative flex items-center gap-2.5 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 rounded-lg font-bold text-sm md:text-base transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 cursor-pointer overflow-hidden"
        disabled={!hasStreamUrl}
      >
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
        <PlaySolidIcon className="w-5 h-5 relative z-10" />
        <span className="relative z-10">Watch Now</span>
      </button>

      {/* Trailer */}
      {onPlayTrailer && (
        <button
          onClick={onPlayTrailer}
          className="flex items-center gap-2 px-5 py-2 bg-white/[0.06] hover:bg-white/[0.12] border border-white/[0.1] hover:border-white/[0.2] text-white/80 hover:text-white rounded-lg font-semibold text-sm md:text-base transition-all duration-300 backdrop-blur-sm cursor-pointer"
        >
          <PlayIcon className="w-5 h-5" />
          <span>Trailer</span>
        </button>
      )}

      {/* Watchlist */}
      <button
        onClick={handleToggleWatchlist}
        className={`flex items-center gap-2 px-5 py-2 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 backdrop-blur-sm cursor-pointer ${inWatchlist
          ? 'bg-amber-500/10 border border-amber-500/25 text-amber-400 hover:bg-amber-500/20'
          : 'bg-white/[0.06] border border-white/[0.1] text-white/60 hover:bg-white/[0.12] hover:text-white hover:border-white/[0.2]'
          } ${justToggled ? 'scale-95' : 'scale-100'}`}
      >
        {inWatchlist ? (
          <BookmarkSolidIcon className={`w-5 h-5 transition-transform duration-300 ${justToggled ? 'scale-125' : 'scale-100'}`} />
        ) : (
          <BookmarkIcon className="w-5 h-5" />
        )}
        <span>{inWatchlist ? 'In Watchlist' : 'Watchlist'}</span>
      </button>
    </div>
  );
};

export default MediaActions;