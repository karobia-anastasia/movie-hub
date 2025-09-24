import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import MovieCard from '@/components/movies/MovieCard/MovieCard';
import MovieDetailsDialog from '@/components/movies/MovieDetailsDialog/MovieDetailsDialog';
import Loader from '@/components/common/Loader/Loader';
import Pagination from '@/components/common/Pagination/Pagination';
import { useSearch } from '@/hooks/useSearch';
import { Movie } from '@/types/movie';

const Search: React.FC = () => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  
  const {
    query,
    results,
    loading,
    error,
    page,
    totalPages,
    totalResults,
    setQuery,
    setPage,
  } = useSearch(queryParam);

  const [selectedMovieId, setSelectedMovieId] = React.useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  useEffect(() => {
    if (queryParam !== query) {
      setQuery(queryParam);
    }
  }, [queryParam]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setDialogOpen(true);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 mt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {query ? `Search Results for "${query}"` : 'Search Movies'}
          </h1>
          {totalResults > 0 && (
            <p className="text-muted-foreground">
              Found {totalResults} {totalResults === 1 ? 'result' : 'results'}
            </p>
          )}
        </div>

        {loading && <Loader variant="film" />}
        
        {error && (
          <div className="text-center py-12">
            <p className="text-destructive">Error: {error}</p>
          </div>
        )}

        {!loading && !error && results.length === 0 && query && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">
              No movies found for "{query}"
            </p>
            <p className="text-muted-foreground mt-2">
              Try searching with different keywords
            </p>
          </div>
        )}

        {!loading && results.length > 0 && (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
              {results.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  onClick={() => handleMovieClick(movie)}
                  variant="compact"
                />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-8">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setPage}
                />
              </div>
            )}
          </>
        )}

        <MovieDetailsDialog
          movieId={selectedMovieId}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        />
      </div>
    </Layout>
  );
};

export default Search;