import { describe, it, expect, vi, beforeEach } from 'vitest';
import { tmdbEndpoints } from './endpoints';
import { tmdbClient } from './client';

// Mock the tmdbClient
vi.mock('./client', () => ({
  tmdbClient: {
    getPopularMovies: vi.fn(),
    getTrendingMovies: vi.fn(),
    getTopRatedMovies: vi.fn(),
    getNowPlayingMovies: vi.fn(),
    getUpcomingMovies: vi.fn(),
    searchMovies: vi.fn(),
    getMovieDetails: vi.fn(),
    getMovieCredits: vi.fn(),
    getSimilarMovies: vi.fn(),
    getRecommendedMovies: vi.fn(),
    getImageUrl: vi.fn(),
    clearCache: vi.fn(),
  },
}));

const mockMovieResponse = {
  page: 1,
  results: [],
  total_pages: 1,
  total_results: 0,
};

const mockMovieDetails = {
  id: 1,
  title: 'Test Movie',
  overview: 'Test overview',
  runtime: 120,
};

const mockCredits = {
  id: 1,
  cast: [],
  crew: [],
};

describe('TMDB Endpoints', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Movie Endpoints', () => {
    it('calls popular movies endpoint with default page', async () => {
      (tmdbClient.getPopularMovies as any).mockResolvedValue(mockMovieResponse);
      
      const result = await tmdbEndpoints.movies.popular();
      
      expect(tmdbClient.getPopularMovies).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockMovieResponse);
    });

    it('calls popular movies endpoint with custom page', async () => {
      (tmdbClient.getPopularMovies as any).mockResolvedValue(mockMovieResponse);
      
      await tmdbEndpoints.movies.popular(3);
      
      expect(tmdbClient.getPopularMovies).toHaveBeenCalledWith(3);
    });

    it('calls trending movies endpoint with default parameters', async () => {
      (tmdbClient.getTrendingMovies as any).mockResolvedValue(mockMovieResponse);
      
      await tmdbEndpoints.movies.trending();
      
      expect(tmdbClient.getTrendingMovies).toHaveBeenCalledWith('week', 1);
    });

    it('calls search movies endpoint', async () => {
      (tmdbClient.searchMovies as any).mockResolvedValue(mockMovieResponse);
      
      await tmdbEndpoints.movies.search('test query', 2);
      
      expect(tmdbClient.searchMovies).toHaveBeenCalledWith('test query', 2);
    });

    it('calls movie details endpoint', async () => {
      (tmdbClient.getMovieDetails as any).mockResolvedValue(mockMovieDetails);
      
      const result = await tmdbEndpoints.movies.details(123);
      
      expect(tmdbClient.getMovieDetails).toHaveBeenCalledWith(123);
      expect(result).toEqual(mockMovieDetails);
    });
  });

  describe('Utility Endpoints', () => {
    it('calls getImageUrl utility', () => {
      (tmdbClient.getImageUrl as any).mockReturnValue('https://test-url.com/image.jpg');
      
      const result = tmdbEndpoints.utils.getImageUrl('/test.jpg', 'w500');
      
      expect(tmdbClient.getImageUrl).toHaveBeenCalledWith('/test.jpg', 'w500');
      expect(result).toBe('https://test-url.com/image.jpg');
    });

    it('calls clearCache utility', () => {
      tmdbEndpoints.utils.clearCache();
      
      expect(tmdbClient.clearCache).toHaveBeenCalledTimes(1);
    });
  });

  describe('Error Propagation', () => {
    it('propagates errors from client methods', async () => {
      const testError = new Error('Client error');
      (tmdbClient.getPopularMovies as any).mockRejectedValue(testError);
      
      await expect(tmdbEndpoints.movies.popular()).rejects.toThrow('Client error');
    });
  });
});