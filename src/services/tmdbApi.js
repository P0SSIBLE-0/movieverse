// src/services/tmdbApi.js
import axios from "axios";

const BASE_URL = "https://api.themoviedb.org/3";

const TMDB_API_KEY = import.meta.env.VITE_APP_TMDB_API_KEY;

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
  },
});

export const fetchTrending = (mediaType = "all", timeWindow = "day") =>
  api.get(`/trending/${mediaType}/${timeWindow}`);

export const fetchPopular = (mediaType = "movie", page = 1) =>
  api.get(`/${mediaType}/popular`, { params: { page } });

export const fetchTopRated = (mediaType = "movie", page = 1) =>
  api.get(`/${mediaType}/top_rated`, { params: { page } });

export const fetchDetails = (mediaType, id) =>
  api.get(`/${mediaType}/${id}`, {
    params: {
      append_to_response:
        "videos,credits,recommendations" +
        (mediaType === "tv" ? ",seasons" : ""),
    },
  });
export const searchMulti = (query, page = 1) =>
  api.get("/search/multi", { params: { query, page, include_adult: false } });

// Helper to get full image URL
export const getImageUrl = (path, size = "original") => {
  return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
};

// Fetch genres - useful for filtering or displaying
export const fetchGenres = (mediaType = "movie") => {
  const type = mediaType === "anime" ? "tv" : mediaType;
  return api.get(`/genre/${type}/list`,{
    params: {
      with_original_language: "ja",
    },
  });
};


export const fetchGenreMovies = (genreId, page = 1) =>
  api.get("/discover/movie", {
    params: {
      with_genres: genreId,
      page,
    },
  });

export const fetchGenreTVShows = (genreId, page = 1) =>
  api.get("/discover/tv", {
    params: {
      with_genres: genreId,
      page,
    },
  });

  export const fetchAnimeTV = (genreId = 16, page = 1) =>
    api.get("/discover/tv", {
      params: {
        with_genres: genreId,
        with_origin_country: "JP",
        page,
      },
    });

export const fetchPersonDetails = (personId) =>
  api.get(`/person/${personId}`);

export const fetchPersonCredits = (personId) =>
  api.get(`/person/${personId}/combined_credits`);

export default api;
