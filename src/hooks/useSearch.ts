import { useState, useCallback, useEffect, useRef } from 'react';
import { Movie } from '@/types/movie';
import { tmdbEndpoints } from '@/api/tmdb';
import { debounce } from '@/utils/helpers';

export const useSearch = (initialQuery = '') => {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);

  const searchMovies = useCallback(async (searchQuery: string, searchPage: number) => {
    if (!searchQuery.trim()) {
      setResults([]);
      setTotalPages(0);
      setTotalResults(0);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const response = await tmdbEndpoints.movies.search(searchQuery, searchPage);
      setResults(response.results);
      setTotalPages(response.total_pages);
      setTotalResults(response.total_results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Stable reference to prevent debounce recreation
  const searchMoviesRef = useRef(searchMovies);
  searchMoviesRef.current = searchMovies;

  const debouncedSearch = useCallback(
    debounce((searchQuery: string, searchPage: number) => {
      searchMoviesRef.current(searchQuery, searchPage);
    }, 500),
    [] // Empty dependencies since we use ref
  );

  useEffect(() => {
    debouncedSearch(query, page);
  }, [query, page, debouncedSearch]);

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    setPage(1); // Reset to first page on new search
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return {
    query,
    results,
    loading,
    error,
    page,
    totalPages,
    totalResults,
    setQuery: handleQueryChange,
    setPage: handlePageChange,
  };
};