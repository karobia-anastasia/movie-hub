import { useState, useEffect, useCallback, useRef } from 'react';
import { Movie, MovieResponse } from '@/types/movie';
import { tmdbEndpoints } from '@/api/tmdb';

export const useMovies = (
  fetchFunction: (page: number) => Promise<MovieResponse>,
  page = 1
) => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  // Use ref to store latest fetchFunction to avoid dependency issues
  const fetchFunctionRef = useRef(fetchFunction);
  fetchFunctionRef.current = fetchFunction;

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetchFunctionRef.current(page);
      setMovies(response.results);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch movies');
    } finally {
      setLoading(false);
    }
  }, [page]); // Only depend on page, not fetchFunction

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  return {
    movies,
    loading,
    error,
    totalPages,
    totalResults,
    refetch: fetchMovies,
  };
};