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

const getDefaultGenreId = (mediaType: MediaType) =>
  defaultGenres[mediaType] ?? defaultGenres.tv;

const resolveGenreId = (
  requestedGenre: number | null,
  genresList: Genre[],
  mediaType: MediaType
) => {
  if (!genresList.length) {
    return null;
  }

  if (requestedGenre && isValidGenre(requestedGenre, genresList)) {
    return requestedGenre;
  }

  const defaultGenreId = getDefaultGenreId(mediaType);

  if (isValidGenre(defaultGenreId, genresList)) {
    return defaultGenreId;
  }

  return genresList[0]?.id ?? null;
};

export const useExplore = (
  query: MediaType = 'movie',
  requestedGenre: number | null = null
) => {
  const [page, setPage] = useState(1);
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);
  const [data, setData] = useState<PaginatedResponse<MediaItem>>(emptyData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestId = useRef(0);
  const isInitializingGenres = useRef(false);

  useEffect(() => {
    let isMounted = true;
    const thisRequest = ++requestId.current;
    const controller = new AbortController();
    const signal = controller.signal;

    const loadInitialData = async () => {
      isInitializingGenres.current = true;
      setLoading(true);
      setError(null);
      setPage(1);
      setGenres([]);
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

    void loadInitialData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    if (!genres.length) {
      return;
    }

    const nextGenre = resolveGenreId(requestedGenre, genres, query);

    setPage(1);
    setActiveGenre((currentGenre) =>
      currentGenre === nextGenre ? currentGenre : nextGenre
    );
  }, [genres, requestedGenre, query]);

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
    genres,
    data,
    loading,
    error,
  };
};
