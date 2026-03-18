'use client';

import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import type {
  MediaType,
  ProvidersProps,
  WatchlistContextValue,
  WatchlistItem,
  WatchlistSourceItem,
} from '../types';

const WatchlistContext = createContext<WatchlistContextValue | undefined>(undefined);

const STORAGE_KEY = 'movieverse_watchlist';

export const WatchlistProvider = ({ children }: ProvidersProps) => {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      setWatchlist(stored ? JSON.parse(stored) : []);
    } catch {
      setWatchlist([]);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  // Persist to localStorage whenever watchlist changes
  useEffect(() => {
    if (!hasHydrated) return;

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(watchlist));
    } catch (err) {
      console.error('Failed to save watchlist:', err);
    }
  }, [hasHydrated, watchlist]);

  // Add an item to the watchlist
  const addToWatchlist = useCallback((item: WatchlistSourceItem) => {
    setWatchlist((prev) => {
      const exists = prev.some(
        (w) => w.id === item.id && w.media_type === item.media_type
      );
      if (exists) return prev;

      const watchlistItem = {
        id: item.id,
        media_type: item.media_type,
        title: item.title || item.name || 'Untitled',
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
  const removeFromWatchlist = useCallback((id: number, mediaType: MediaType) => {
    setWatchlist((prev) =>
      prev.filter((w) => !(w.id === id && w.media_type === mediaType))
    );
  }, []);

  const toggleWatchlist = useCallback((item: WatchlistSourceItem) => {
    const exists = watchlist.some(
      (w) => w.id === item.id && w.media_type === item.media_type
    );
    if (exists) {
      removeFromWatchlist(item.id, item.media_type);
    } else {
      addToWatchlist(item);
    }
    return !exists;
  }, [watchlist, addToWatchlist, removeFromWatchlist]);

  const isInWatchlist = useCallback((id: number, mediaType: MediaType) => {
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
