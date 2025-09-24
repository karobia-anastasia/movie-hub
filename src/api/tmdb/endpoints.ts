import { tmdbClient } from './client';
import { MovieResponse, MovieDetails, Credits } from './types';

export const tmdbEndpoints = {
  movies: {
    popular: (page = 1): Promise<MovieResponse> => 
      tmdbClient.getPopularMovies(page),
    
    trending: (timeWindow: 'day' | 'week' = 'week', page = 1): Promise<MovieResponse> =>
      tmdbClient.getTrendingMovies(timeWindow, page),
    
    topRated: (page = 1): Promise<MovieResponse> =>
      tmdbClient.getTopRatedMovies(page),
    
    nowPlaying: (page = 1): Promise<MovieResponse> =>
      tmdbClient.getNowPlayingMovies(page),
    
    upcoming: (page = 1): Promise<MovieResponse> =>
      tmdbClient.getUpcomingMovies(page),
    
    search: (query: string, page = 1): Promise<MovieResponse> =>
      tmdbClient.searchMovies(query, page),
    
    details: (movieId: number): Promise<MovieDetails> =>
      tmdbClient.getMovieDetails(movieId),
    
    credits: (movieId: number): Promise<Credits> =>
      tmdbClient.getMovieCredits(movieId),
    
    similar: (movieId: number, page = 1): Promise<MovieResponse> =>
      tmdbClient.getSimilarMovies(movieId, page),
    
    recommended: (movieId: number, page = 1): Promise<MovieResponse> =>
      tmdbClient.getRecommendedMovies(movieId, page),
  },
  
  utils: {
    getImageUrl: tmdbClient.getImageUrl.bind(tmdbClient),
    clearCache: tmdbClient.clearCache.bind(tmdbClient),
  },
};