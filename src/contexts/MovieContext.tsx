import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { Movie, MovieDetails } from '@/types/movie';

interface MovieContextType {
  selectedMovie: MovieDetails | null;
  setSelectedMovie: (movie: MovieDetails | null) => void;
  favorites: Movie[];
  addToFavorites: (movie: Movie) => void;
  removeFromFavorites: (movieId: number) => void;
  isFavorite: (movieId: number) => boolean;
  watchlist: Movie[];
  addToWatchlist: (movie: Movie) => void;
  removeFromWatchlist: (movieId: number) => void;
  isInWatchlist: (movieId: number) => boolean;
}

const MovieContext = createContext<MovieContextType | undefined>(undefined);

export const MovieProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);
  const [favorites, setFavorites] = useState<Movie[]>(() => {
    const stored = localStorage.getItem('movie_favorites');
    return stored ? JSON.parse(stored) : [];
  });
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const stored = localStorage.getItem('movie_watchlist');
    return stored ? JSON.parse(stored) : [];
  });

  const addToFavorites = useCallback((movie: Movie) => {
    setFavorites((prev) => {
      const updated = [...prev, movie];
      localStorage.setItem('movie_favorites', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromFavorites = useCallback((movieId: number) => {
    setFavorites((prev) => {
      const updated = prev.filter((m) => m.id !== movieId);
      localStorage.setItem('movie_favorites', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isFavorite = useCallback(
    (movieId: number) => {
      return favorites.some((m) => m.id === movieId);
    },
    [favorites]
  );

  const addToWatchlist = useCallback((movie: Movie) => {
    setWatchlist((prev) => {
      const updated = [...prev, movie];
      localStorage.setItem('movie_watchlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromWatchlist = useCallback((movieId: number) => {
    setWatchlist((prev) => {
      const updated = prev.filter((m) => m.id !== movieId);
      localStorage.setItem('movie_watchlist', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isInWatchlist = useCallback(
    (movieId: number) => {
      return watchlist.some((m) => m.id === movieId);
    },
    [watchlist]
  );

  const contextValue = useMemo(
    () => ({
      selectedMovie,
      setSelectedMovie,
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
    }),
    [
      selectedMovie,
      favorites,
      addToFavorites,
      removeFromFavorites,
      isFavorite,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
    ]
  );

  return (
    <MovieContext.Provider value={contextValue}>
      {children}
    </MovieContext.Provider>
  );
};

export const useMovieContext = () => {
  const context = useContext(MovieContext);
  if (context === undefined) {
    throw new Error('useMovieContext must be used within a MovieProvider');
  }
  return context;
};