import { useState, useEffect, useCallback, useRef } from 'react';
import {
  fetchGenres,
  fetchGenreMovies,
  fetchGenreTVShows,
  fetchAnimeTV,
} from '../services/tmdbApi';
import type { ApiErrorShape, Genre, MediaItem, MediaType, PaginatedResponse } from '../types';

const defaultGenres: Record<MediaType, number> = {
  movie: 28,
  tv: 10759,
  anime: 16,
};

const emptyData: PaginatedResponse<MediaItem> = {
  results: [],
  total_pages: 0,
};

const isValidGenre = (genreId: number, genresList: Genre[]) =>
  genresList.some((genre) => genre.id === genreId);

export const useExplore = (query: MediaType = 'movie', initialGenre: number | null = null) => {
  const [page, setPage] = useState(1);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [data, setData] = useState<PaginatedResponse<MediaItem>>(emptyData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);
  const isInitializingGenres = useRef(false);
  const currentQuery = useRef(query);

  const getDefaultGenreId = (mediaType: MediaType) => defaultGenres[mediaType] ?? defaultGenres.tv;

  useEffect(() => {
    const hasQueryChanged = currentQuery.current !== query;
    currentQuery.current = query;

    let isMounted = true;
    const thisRequest = ++requestId.current;
    const controller = new AbortController();
    const signal = controller.signal;

    const loadInitialData = async () => {
      isInitializingGenres.current = true;
      setLoading(true);
      setError(null);
      setPage(1);
      setData(emptyData);
      setActiveGenre(null);

      try {
        const mediaType = query === 'anime' ? 'tv' : query;
        const genresRes = await fetchGenres(mediaType, signal);

        if (!isMounted || thisRequest !== requestId.current) {
          return;
        }

        const fetchedGenres = genresRes.data.genres || [];
        setGenres(fetchedGenres);

        if (fetchedGenres.length === 0) {
          setError('No genres found.');
          setLoading(false);
          isInitializingGenres.current = false;
          return;
        }

        const defaultGenreId = getDefaultGenreId(query);
        const preferredGenreId =
          initialGenre && isValidGenre(initialGenre, fetchedGenres)
            ? initialGenre
            : defaultGenreId;
        const selectedGenreId = isValidGenre(preferredGenreId, fetchedGenres)
          ? preferredGenreId
          : fetchedGenres[0].id;

        const dataRes =
          query === 'movie'
            ? await fetchGenreMovies(selectedGenreId, 1, signal)
            : query === 'anime'
              ? await fetchAnimeTV(selectedGenreId, 1, signal)
              : await fetchGenreTVShows(selectedGenreId, 1, signal);

        if (!isMounted || thisRequest !== requestId.current) {
          return;
        }

        setData({
          results: dataRes.data.results || [],
          total_pages: Math.min(dataRes.data.total_pages || 1, 500),
        });
        setActiveGenre(selectedGenreId);
      } catch (err) {
        const apiError = err as ApiErrorShape;

        if (!signal.aborted && isMounted && thisRequest === requestId.current) {
          setError(apiError.response?.data?.status_message || 'Failed to load data');
          setData(emptyData);
        }
      } finally {
        if (isMounted && thisRequest === requestId.current) {
          setLoading(false);
          isInitializingGenres.current = false;
        }
      }
    };

    if (hasQueryChanged || activeGenre === null) {
      void loadInitialData();
    }

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [activeGenre, initialGenre, query]);

  useEffect(() => {
    if (!activeGenre || isInitializingGenres.current) return;

    let isMounted = true;
    const thisRequest = ++requestId.current;
    const controller = new AbortController();
    const signal = controller.signal;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response =
          query === 'movie'
            ? await fetchGenreMovies(activeGenre, page, signal)
            : query === 'anime'
              ? await fetchAnimeTV(activeGenre, page, signal)
              : await fetchGenreTVShows(activeGenre, page, signal);

        if (!isMounted || thisRequest !== requestId.current) {
          return;
        }

        setData({
          results: response.data.results || [],
          total_pages: Math.min(response.data.total_pages || 1, 500),
        });
      } catch (err) {
        const apiError = err as ApiErrorShape;

        if (!signal.aborted && isMounted && thisRequest === requestId.current) {
          setError(apiError.response?.data?.status_message || 'Failed to fetch data');
          setData(emptyData);
        }
      } finally {
        if (isMounted && thisRequest === requestId.current) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [activeGenre, page, query]);

  const handleGenreChange = useCallback(
    (genreId: number) => {
      if (genreId === activeGenre) return;
      setPage(1);
      setActiveGenre(genreId);
    },
    [activeGenre]
  );

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage < 1 || newPage > (data.total_pages || 1)) return;
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [data.total_pages]
  );

  return {
    page,
    setPage: handlePageChange,
    activeGenre,
    setActiveGenre: handleGenreChange,
    genres,
    data,
    loading,
    error,
  };
};
