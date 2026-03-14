import React, { useState } from 'react';
import { PlayIcon, BookmarkIcon } from '@heroicons/react/24/outline';
import { BookmarkIcon as BookmarkSolidIcon } from '@heroicons/react/24/solid';
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
    <div className="flex items-center flex-wrap gap-3 md:gap-4 lg:mt-4">
      <button
        onClick={onPlayStream}
        className="bg-brand-orange text-white px-4 py-2 md:px-6 md:py-2.5 rounded-md font-semibold flex items-center space-x-2 hover:opacity-90 transition-opacity text-sm md:text-base disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!hasStreamUrl}
      >
        <PlayIcon className="w-5 h-5" />
        <span>Watch Now</span>
      </button>

      {onPlayTrailer && (
        <button
          onClick={onPlayTrailer}
          className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 md:px-6 md:py-2.5 rounded-md font-semibold flex items-center space-x-2 hover:bg-white/30 transition-colors text-sm md:text-base"
        >
          <PlayIcon className="w-5 h-5" />
          <span>Trailer</span>
        </button>
      )}

      <button
        onClick={handleToggleWatchlist}
        className={`backdrop-blur-sm px-4 py-2 md:px-6 md:py-2.5 rounded-md font-semibold flex items-center justify-center space-x-2 transition-all duration-300 text-sm md:text-base cursor-pointer ${inWatchlist
          ? 'bg-brand-yellow/20 text-brand-yellow hover:bg-brand-yellow/30'
          : 'bg-white/10 text-white hover:bg-white/20'
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