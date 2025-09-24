import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import Hero from '@/components/movies/Hero/Hero';
import MovieRow from '@/components/movies/MovieRow/MovieRow';
import MovieDetailsDialog from '@/components/movies/MovieDetailsDialog/MovieDetailsDialog';
import MovieTrailer from '@/components/movies/MovieTrailer/MovieTrailer';
import { tmdbEndpoints } from '@/api/tmdb';
import { Movie, MovieResponse } from '@/types/movie';
import { useMovies } from '@/hooks/useMovies';

const Home: React.FC = () => {
  const [heroMovie, setHeroMovie] = useState<Movie | null>(null);
  const [selectedMovieId, setSelectedMovieId] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [trailerOpen, setTrailerOpen] = useState(false);
  const [trailerMovieId, setTrailerMovieId] = useState<number | null>(null);
  
  const popular = useMovies(tmdbEndpoints.movies.popular);
  const trending = useMovies((page) => tmdbEndpoints.movies.trending('week', page));
  const topRated = useMovies(tmdbEndpoints.movies.topRated);
  const nowPlaying = useMovies(tmdbEndpoints.movies.nowPlaying);

  useEffect(() => {
    if (trending.movies.length > 0 && !heroMovie) {
      setHeroMovie(trending.movies[0]);
    }
  }, [trending.movies]);

  const handleMovieClick = (movie: Movie) => {
    setSelectedMovieId(movie.id);
    setDialogOpen(true);
  };

  const handlePlayTrailer = (movieId: number) => {
    setTrailerMovieId(movieId);
    setTrailerOpen(true);
  };

  return (
    <Layout>
      <Hero 
        movie={heroMovie} 
        onPlayClick={() => heroMovie && handlePlayTrailer(heroMovie.id)}
        onInfoClick={() => heroMovie && handleMovieClick(heroMovie)}
      />
      
      <div className="container mx-auto px-4 py-8 space-y-12">
        <MovieRow
          title="Trending Now"
          movies={trending.movies}
          loading={trending.loading}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Popular Movies"
          movies={popular.movies}
          loading={popular.loading}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Top Rated"
          movies={topRated.movies}
          loading={topRated.loading}
          onMovieClick={handleMovieClick}
        />
        <MovieRow
          title="Now Playing"
          movies={nowPlaying.movies}
          loading={nowPlaying.loading}
          onMovieClick={handleMovieClick}
        />
      </div>

      <MovieDetailsDialog
        movieId={selectedMovieId}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      <MovieTrailer
        movieId={trailerMovieId}
        open={trailerOpen}
        onOpenChange={setTrailerOpen}
      />
    </Layout>
  );
};

export default Home;