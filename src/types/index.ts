import type { ReactNode } from "react";

export type MediaType = "movie" | "tv" | "anime";
export type ExploreCategory = MediaType | "all";
export type WatchlistFilter = "all" | "movie" | "tv";
export type CreditTab = "all" | "movies" | "tv";

export interface Genre {
  id: number;
  name: string;
}

export interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

export interface Season {
  season_number: number;
  episode_count: number;
  name?: string;
}

export interface MediaItem {
  id: number;
  media_type?: MediaType | "person";
  title?: string;
  name?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  profile_path?: string | null;
  overview?: string;
  vote_average?: number;
  vote_count?: number;
  release_date?: string;
  first_air_date?: string;
}

export interface MediaDetails extends MediaItem {
  genres?: Genre[];
  tagline?: string;
  runtime?: number;
  episode_run_time?: number[];
  number_of_seasons?: number;
  seasons?: Season[];
  videos?: {
    results: VideoResult[];
  };
  credits?: {
    cast: CastMember[];
  };
  recommendations?: {
    results: MediaItem[];
  };
}

export interface CastMember extends MediaItem {
  cast_id?: number;
  credit_id?: string;
  character?: string;
  known_for_department?: string;
}

export interface PersonDetails {
  id: number;
  name: string;
  profile_path?: string | null;
  birthday?: string | null;
  deathday?: string | null;
  place_of_birth?: string | null;
  biography?: string;
  known_for_department?: string;
}

export interface PersonCreditsResponse {
  cast: CastMember[];
}

export interface PaginatedResponse<T> {
  page?: number;
  results: T[];
  total_pages: number;
  total_results?: number;
}

export interface TmdbImageConfig {
  base_url: string;
  secure_base_url: string;
  backdrop_sizes: string[];
  poster_sizes: string[];
  profile_sizes: string[];
}

export interface TmdbConfig {
  images: TmdbImageConfig;
}

export interface AppContextValue {
  apiConfig: TmdbConfig | null;
  loadingConfig: boolean;
  getImageUrl: (path?: string | null, size?: string) => string;
}

export interface WatchlistItem {
  id: number;
  media_type: MediaType;
  title: string;
  poster_path?: string | null;
  vote_average: number;
  release_date: string;
  overview: string;
  added_at: number;
}

export interface WatchlistSourceItem extends MediaItem {
  media_type: MediaType;
}

export interface WatchlistContextValue {
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistSourceItem) => void;
  removeFromWatchlist: (id: number, mediaType: MediaType) => void;
  toggleWatchlist: (item: WatchlistSourceItem) => boolean;
  isInWatchlist: (id: number, mediaType: MediaType) => boolean;
}

export interface ProvidersProps {
  children: ReactNode;
}

export interface HeaderProps {
  onMenuClick?: () => void;
}

export interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export interface DropdownOption<T extends string | number = string | number> {
  value: T;
  label: string;
}

export interface DropdownProps<T extends string | number = string | number> {
  options?: DropdownOption<T>[];
  value: T;
  onChange: (value: T) => void;
  icon?: ReactNode;
  heading?: string | null;
  placeholder?: string;
  minWidth?: string;
  showIndex?: boolean;
  panelAlign?: "left" | "right";
}

export interface StreamPlayerProps {
  id: string;
  mediaType: MediaType;
  title: string;
  streamEmbedUrl: string;
  seasons: Season[];
  selectedSeason: number;
  selectedEpisode: number;
  onSeasonChange: (season: number) => void;
  onEpisodeChange: (episode: number) => void;
  episodesForSelectedSeason: number[];
  onError: (error?: unknown) => void;
  selectedProvider: string;
  onProviderChange: (providerId: string) => void;
}

export interface ContentRowProps {
  title: string;
  fetchFunction: (...args: unknown[]) => Promise<{ data: PaginatedResponse<MediaItem> }>;
  apiParams?: unknown[];
  mediaType?: MediaType;
}

export interface ApiErrorShape {
  response?: {
    data?: {
      status_message?: string;
    };
  };
  message?: string;
}
