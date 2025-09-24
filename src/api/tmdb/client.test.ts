import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { tmdbClient } from './client';
import { MovieResponse, MovieDetails, Credits, TMDBConfig } from './types';

// Mock the configuration service
vi.mock('@/config', () => ({
  configService: {
    getTmdbApiBaseUrl: vi.fn(() => 'https://api.themoviedb.org/3'),
    getTmdbAccessToken: vi.fn(() => 'test_token'),
    getTmdbImageBaseUrl: vi.fn(() => 'https://image.tmdb.org/t/p'),
    getApiTimeout: vi.fn(() => 10000),
    getCacheTimeout: vi.fn((type) => {
      const timeouts = {
        search: 120000,
        details: 900000,
        lists: 300000,
        default: 300000
      };
      return timeouts[type] || timeouts.default;
    }),
    getAuthHeaders: vi.fn(() => ({
      'Authorization': 'Bearer test_token',
      'accept': 'application/json'
    })),
    getImageUrl: vi.fn((path, size = 'w500') => {
      if (!path) return '/placeholder.svg';
      return `https://image.tmdb.org/t/p/${size}${path}`;
    })
  }
}));

// Mock fetch globally
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock data
const mockMovieResponse: MovieResponse = {
  page: 1,
  results: [
    {
      id: 1,
      title: 'Test Movie',
      overview: 'Test overview',
      poster_path: '/test.jpg',
      backdrop_path: '/backdrop.jpg',
      release_date: '2023-01-15',
      vote_average: 8.5,
      vote_count: 1000,
      popularity: 100,
      genre_ids: [28, 12],
      adult: false,
      original_language: 'en',
      original_title: 'Test Movie',
      video: false,
    },
  ],
  total_pages: 10,
  total_results: 200,
};

const mockMovieDetails: MovieDetails = {
  ...mockMovieResponse.results[0],
  runtime: 120,
  budget: 10000000,
  revenue: 50000000,
  genres: [{ id: 28, name: 'Action' }],
  production_companies: [],
  production_countries: [],
  spoken_languages: [],
  status: 'Released',
  tagline: 'Test tagline',
  belongs_to_collection: null,
  homepage: '',
  imdb_id: 'tt1234567',
};

describe('TMDBClient', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    tmdbClient.clearCache();
    
    mockFetch.mockResolvedValue({
      ok: true,
      status: 200,
      json: () => Promise.resolve(mockMovieResponse),
    });
  });

  describe('Cache Management', () => {
    it('caches successful responses', async () => {
      const result1 = await tmdbClient.getPopularMovies(1);
      const result2 = await tmdbClient.getPopularMovies(1);

      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(result1).toEqual(result2);
    });

    it('respects cache timeout for different types', async () => {
      vi.useFakeTimers();
      
      await tmdbClient.searchMovies('test');
      
      vi.advanceTimersByTime(60 * 1000);
      await tmdbClient.searchMovies('test');
      
      expect(mockFetch).toHaveBeenCalledTimes(1);
      
      vi.advanceTimersByTime(61 * 1000);
      await tmdbClient.searchMovies('test');
      
      expect(mockFetch).toHaveBeenCalledTimes(2);
      
      vi.useRealTimers();
    });

    it('clears cache when requested', async () => {
      await tmdbClient.getPopularMovies(1);
      expect(mockFetch).toHaveBeenCalledTimes(1);

      tmdbClient.clearCache();
      await tmdbClient.getPopularMovies(1);
      
      expect(mockFetch).toHaveBeenCalledTimes(2);
    });
  });

  describe('Movie List Endpoints', () => {
    it('gets popular movies', async () => {
      const result = await tmdbClient.getPopularMovies(1);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/popular?page=1'),
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': expect.stringMatching(/Bearer .+/),
            'accept': 'application/json',
          }),
        })
      );
      
      expect(result).toEqual(mockMovieResponse);
    });

    it('gets trending movies with custom timeWindow', async () => {
      await tmdbClient.getTrendingMovies('day', 2);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/trending/movie/day?page=2'),
        expect.any(Object)
      );
    });

    it('gets top rated movies', async () => {
      await tmdbClient.getTopRatedMovies(3);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/top_rated?page=3'),
        expect.any(Object)
      );
    });
  });

  describe('Search Functionality', () => {
    it('searches movies with encoded query', async () => {
      const query = 'test movie with spaces & special chars';
      const encodedQuery = encodeURIComponent(query);
      
      await tmdbClient.searchMovies(query, 2);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining(`/search/movie?query=${encodedQuery}&page=2`),
        expect.any(Object)
      );
    });
  });

  describe('Movie Details', () => {
    it('gets movie details', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockMovieDetails),
      });
      
      const result = await tmdbClient.getMovieDetails(1);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/1'),
        expect.any(Object)
      );
      
      expect(result).toEqual(mockMovieDetails);
    });
  });

  describe('Image URL Generation', () => {
    it('generates correct image URLs with default size', () => {
      const path = '/test-image.jpg';
      const url = tmdbClient.getImageUrl(path);
      
      expect(url).toBe('https://image.tmdb.org/t/p/w500/test-image.jpg');
    });

    it('handles null path with placeholder', () => {
      const url = tmdbClient.getImageUrl(null);
      
      expect(url).toBe('/placeholder.svg');
    });

    it('works with all supported sizes', () => {
      const path = '/test.jpg';
      const sizes = ['w200', 'w300', 'w500', 'w780', 'original'] as const;
      
      sizes.forEach(size => {
        const url = tmdbClient.getImageUrl(path, size);
        expect(url).toBe(`https://image.tmdb.org/t/p/${size}/test.jpg`);
      });
    });
  });

  describe('Error Handling', () => {
    it('throws error on HTTP error status', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });
      
      await expect(tmdbClient.getPopularMovies()).rejects.toThrow('TMDB API Error: 404');
    });

    it('throws error on network failure', async () => {
      mockFetch.mockRejectedValueOnce(new Error('Network error'));
      
      await expect(tmdbClient.getPopularMovies()).rejects.toThrow('Network error');
    });

    it('logs errors to console', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      
      mockFetch.mockRejectedValueOnce(new Error('Test error'));
      
      try {
        await tmdbClient.getPopularMovies();
      } catch (e) {
        // Expected to throw
      }
      
      expect(consoleSpy).toHaveBeenCalledWith('TMDB API Error:', expect.any(Error));
      
      consoleSpy.mockRestore();
    });

    it('handles timeout correctly', async () => {
      const abortError = new Error('Request timeout');
      abortError.name = 'AbortError';
      
      mockFetch.mockRejectedValueOnce(abortError);
      
      await expect(tmdbClient.getPopularMovies()).rejects.toThrow('Request timeout');
    });
  });

  describe('Movie Videos', () => {
    it('gets movie videos', async () => {
      const mockVideosResponse = {
        results: [
          {
            id: 'video1',
            key: 'dQw4w9WgXcQ',
            name: 'Official Trailer',
            site: 'YouTube',
            type: 'Trailer'
          }
        ]
      };
      
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: () => Promise.resolve(mockVideosResponse),
      });
      
      const result = await tmdbClient.getMovieVideos(123);
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/movie/123/videos'),
        expect.any(Object)
      );
      
      expect(result).toEqual(mockVideosResponse);
    });
  });
});