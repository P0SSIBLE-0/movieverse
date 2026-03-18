'use client';

import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/tmdbApi';
import type { AppContextValue, ProvidersProps, TmdbConfig } from '../types';

const fallbackConfig: TmdbConfig = {
  images: {
    base_url: 'http://image.tmdb.org/t/p/',
    secure_base_url: 'https://image.tmdb.org/t/p/',
    backdrop_sizes: ['w300', 'w780', 'w1280', 'original'],
    poster_sizes: ['w92', 'w154', 'w185', 'w342', 'w500', 'w780', 'original'],
    profile_sizes: ['w45', 'w185', 'h632', 'original'],
  },
};

export const AppContext = createContext<AppContextValue | undefined>(undefined);

export const AppProvider = ({ children }: ProvidersProps) => {
  const [apiConfig, setApiConfig] = useState<TmdbConfig | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(true);

  useEffect(() => {
    api
      .get<TmdbConfig>('/configuration')
      .then((res) => {
        setApiConfig(res.data);
        setLoadingConfig(false);
      })
      .catch((err) => {
        console.error('Failed to fetch TMDB config:', err);
        setApiConfig(fallbackConfig);
        setLoadingConfig(false);
      });
  }, []);

  const getImageUrl = (path?: string | null, size = 'w500') => {
    if (!apiConfig || !path) {
      return 'https://placehold.co/500x750';
    }
    const availableSizes = [
      ...(apiConfig.images.poster_sizes || []),
      ...(apiConfig.images.backdrop_sizes || []),
    ];
    const chosenSize = availableSizes.includes(size) ? size : 'original';

    return `${apiConfig.images.secure_base_url}${chosenSize}${path}`;
  };

  return (
    <AppContext.Provider value={{ apiConfig, loadingConfig, getImageUrl }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }

  return context;
};
