import { configService } from '@/config';

// Use configuration service for dynamic values
export const getTmdbImageBaseUrl = () => configService.getTmdbImageBaseUrl();
export const getImageUrl = (path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500') => {
  return configService.getImageUrl(path, size);
};

// For backward compatibility - these can be deprecated later
export const TMDB_IMAGE_BASE_URL = getTmdbImageBaseUrl();

export const IMAGE_SIZES = {
  poster: {
    small: 'w200',
    medium: 'w300',
    large: 'w500',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
} as const;

export const MOVIE_CATEGORIES = {
  POPULAR: 'popular',
  TRENDING: 'trending',
  TOP_RATED: 'top_rated',
  NOW_PLAYING: 'now_playing',
  UPCOMING: 'upcoming',
} as const;

export const ITEMS_PER_PAGE = 20;

export const RATING_COLORS = {
  HIGH: 'hsl(120, 70%, 50%)', // Green
  MEDIUM: 'hsl(45, 90%, 50%)', // Yellow
  LOW: 'hsl(0, 70%, 50%)', // Red
} as const;

export const getRatingColor = (rating: number): string => {
  if (rating >= 7) return RATING_COLORS.HIGH;
  if (rating >= 5) return RATING_COLORS.MEDIUM;
  return RATING_COLORS.LOW;
};