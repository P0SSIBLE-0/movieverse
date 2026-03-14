// src/context/WatchlistContext.jsx
import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';

const WatchlistContext = createContext();

const STORAGE_KEY = 'movieverse_watchlist';

export const WatchlistProvider = ({ children }) => {
  const [watchlist, setWatchlist] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage whenever watchlist changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (err) {
      console.error('Failed to save watchlist:', err);
    }
  }, [watchlist]);

  // Add an item to the watchlist
  const addToWatchlist = useCallback((item) => {
    setWatchlist((prev) => {
      // Prevent duplicates (using id + media_type as unique key)
      const exists = prev.some(
        (w) => w.id === item.id && w.media_type === item.media_type
      );
      if (exists) return prev;

      const watchlistItem = {
        id: item.id,
        media_type: item.media_type,
        title: item.title || item.name,
        poster_path: item.poster_path,
        vote_average: item.vote_average || 0,
        release_date: item.release_date || item.first_air_date || '',
        overview: item.overview || '',
        added_at: Date.now(),
      };
      return [watchlistItem, ...prev];
    });
  }, []);

  // Remove an item from the watchlist
  const removeFromWatchlist = useCallback((id, mediaType) => {
    setWatchlist((prev) =>
      prev.filter((w) => !(w.id === id && w.media_type === mediaType))
    );
  }, []);

  // Toggle an item in/out of the watchlist
  const toggleWatchlist = useCallback((item) => {
    const exists = watchlist.some(
      (w) => w.id === item.id && w.media_type === item.media_type
    );
    if (exists) {
      removeFromWatchlist(item.id, item.media_type);
    } else {
      addToWatchlist(item);
    }
    return !exists; // returns true if added, false if removed
  }, [watchlist, addToWatchlist, removeFromWatchlist]);

  // Check if item is in watchlist
  const isInWatchlist = useCallback((id, mediaType) => {
    return watchlist.some((w) => w.id === id && w.media_type === mediaType);
  }, [watchlist]);

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        toggleWatchlist,
        isInWatchlist,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
};

export const useWatchlist = () => {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
};
