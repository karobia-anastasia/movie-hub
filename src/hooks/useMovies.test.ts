import { renderHook, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import { useMovies } from './useMovies';
import { MovieResponse } from '@/types/movie';

// Mock movie response data
const mockMovieResponse: MovieResponse = {
  page: 1,
  results: [
    {
      id: 1,
      title: 'Test Movie 1',
      overview: 'Test movie 1 description',
      poster_path: '/test1.jpg',
      backdrop_path: '/backdrop1.jpg',
      release_date: '2023-01-15',
      vote_average: 8.5,
      vote_count: 1000,
      popularity: 100,
      genre_ids: [28, 12],
      adult: false,
      original_language: 'en',
      original_title: 'Test Movie 1',
      video: false,
    },
  ],
  total_pages: 10,
  total_results: 200,
};

describe('useMovies Hook', () => {
  let mockFetchFunction: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockFetchFunction = vi.fn();
  });

  describe('Initial State', () => {
    it('initializes with correct default values', () => {
      mockFetchFunction.mockResolvedValue(mockMovieResponse);
      
      const { result } = renderHook(() => useMovies(mockFetchFunction, 1));

      expect(result.current.movies).toEqual([]);
      expect(result.current.loading).toBe(true);
      expect(result.current.error).toBeNull();
      expect(result.current.totalPages).toBe(0);
      expect(result.current.totalResults).toBe(0);
      expect(typeof result.current.refetch).toBe('function');
    });
  });

  describe('Successful Data Fetching', () => {
    it('fetches movies successfully on mount', async () => {
      mockFetchFunction.mockResolvedValue(mockMovieResponse);

      const { result } = renderHook(() => useMovies(mockFetchFunction, 1));

      expect(mockFetchFunction).toHaveBeenCalledWith(1);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.movies).toEqual(mockMovieResponse.results);
      expect(result.current.totalPages).toBe(mockMovieResponse.total_pages);
      expect(result.current.totalResults).toBe(mockMovieResponse.total_results);
      expect(result.current.error).toBeNull();
    });

    it('fetches different page when page prop changes', async () => {
      mockFetchFunction.mockResolvedValue(mockMovieResponse);

      const { result, rerender } = renderHook(
        ({ page }) => useMovies(mockFetchFunction, page),
        { initialProps: { page: 1 } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockFetchFunction.mockClear();
      rerender({ page: 2 });

      expect(mockFetchFunction).toHaveBeenCalledWith(2);
    });
  });

  describe('Error Handling', () => {
    it('handles fetch errors correctly', async () => {
      const errorMessage = 'Failed to fetch movies';
      mockFetchFunction.mockRejectedValue(new Error(errorMessage));

      const { result } = renderHook(() => useMovies(mockFetchFunction, 1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe(errorMessage);
      expect(result.current.movies).toEqual([]);
    });

    it('handles non-Error objects in catch', async () => {
      mockFetchFunction.mockRejectedValue('String error');

      const { result } = renderHook(() => useMovies(mockFetchFunction, 1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(result.current.error).toBe('Failed to fetch movies');
    });
  });

  describe('Refetch Functionality', () => {
    it('provides working refetch function', async () => {
      mockFetchFunction.mockResolvedValue(mockMovieResponse);

      const { result } = renderHook(() => useMovies(mockFetchFunction, 1));

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      mockFetchFunction.mockClear();
      result.current.refetch();

      expect(mockFetchFunction).toHaveBeenCalledWith(1);
    });

    it('stable refetch function reference', () => {
      mockFetchFunction.mockResolvedValue(mockMovieResponse);

      const { result, rerender } = renderHook(() => useMovies(mockFetchFunction, 1));

      const initialRefetch = result.current.refetch;
      rerender();

      expect(result.current.refetch).toBe(initialRefetch);
    });
  });

  describe('Performance Optimization', () => {
    it('does not refetch when fetchFunction reference changes', async () => {
      const fetchFunction1 = vi.fn().mockResolvedValue(mockMovieResponse);
      const fetchFunction2 = vi.fn().mockResolvedValue(mockMovieResponse);

      const { result, rerender } = renderHook(
        ({ fetchFn }) => useMovies(fetchFn, 1),
        { initialProps: { fetchFn: fetchFunction1 } }
      );

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchFunction1).toHaveBeenCalledTimes(1);

      // Change fetchFunction reference
      rerender({ fetchFn: fetchFunction2 });

      // Explicit refetch should use new function
      result.current.refetch();

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });

      expect(fetchFunction2).toHaveBeenCalledTimes(1);
    });
  });
});