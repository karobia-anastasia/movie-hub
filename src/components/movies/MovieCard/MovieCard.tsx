import React from 'react';
import { Star, Calendar, Heart, Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Movie } from '@/types/movie';
import { tmdbEndpoints } from '@/api/tmdb';
import { formatRating, getYearFromDate, truncateText } from '@/utils/helpers';
import { getRatingColor } from '@/utils/constants';
import { cn } from '@/lib/utils';
import { useMovieContext } from '@/contexts/MovieContext';
import { debounce } from 'lodash';

interface MovieCardProps {
  movie: Movie;
  onClick?: () => void;
  className?: string;
  variant?: 'default' | 'compact';
}

const MovieCardComponent: React.FC<MovieCardProps> = ({
  movie,
  onClick,
  className,
  variant = 'default',
}) => {
  const { isFavorite, addToFavorites, removeFromFavorites, isInWatchlist, addToWatchlist, removeFromWatchlist } = useMovieContext();

  const handleFavoriteClick = debounce((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isFavorite(movie.id)) {
      removeFromFavorites(movie.id);
    } else {
      addToFavorites(movie);
    }
  }, 300);

  const handleWatchlistClick = debounce((e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInWatchlist(movie.id)) {
      removeFromWatchlist(movie.id);
    } else {
      addToWatchlist(movie);
    }
  }, 300);

  const posterUrl = tmdbEndpoints.utils.getImageUrl(movie.poster_path, 'w500');
  const year = getYearFromDate(movie.release_date);

  if (variant === 'compact') {
    return (
      <Card
        className={cn(
          'group relative overflow-hidden cursor-pointer transition-transform duration-300 will-change-transform',
          'hover:scale-105 dark:hover:shadow-xl dark:hover:shadow-primary/20 transform-gpu',
          className
        )}
        style={{ transform: 'translate3d(0, 0, 0)' }}
        onClick={onClick}
      >
        <div className="aspect-[2/3] relative">
          <img
            src={posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
          />
          <div className="absolute inset-0 bg-gradient-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out delay-100" />
          
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out delay-100">
            <Button
              size="icon"
              variant="ghost"
              className="h-8 w-8 bg-background/60 hover:bg-background/80"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={cn('h-4 w-4', isFavorite(movie.id) && 'fill-primary text-primary')}
              />
            </Button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out delay-100">
            <h3 className="font-semibold text-white line-clamp-1">{movie.title}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-white/80">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3" fill="currentColor" />
                {formatRating(movie.vote_average)}
              </span>
              {year && <span>{year}</span>}
            </div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card
      className={cn(
        'group overflow-hidden cursor-pointer transition-transform duration-300 will-change-transform',
        'hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/20 bg-gradient-card transform-gpu',
        className
      )}
      style={{ transform: 'translate3d(0, 0, 0)' }}
      onClick={onClick}
    >
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
          onError={(e) => (e.currentTarget.src = '/placeholder.jpg')}
        />
        <div className="absolute inset-0 bg-gradient-dark opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out delay-100" />
        
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-in-out delay-100">
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 bg-background/60 hover:bg-background/80"
            onClick={handleFavoriteClick}
          >
            <Heart
              className={cn('h-5 w-5', isFavorite(movie.id) && 'fill-primary text-primary')}
            />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-10 w-10 bg-background/60 hover:bg-background/80"
            onClick={handleWatchlistClick}
          >
            <Plus
              className={cn('h-5 w-5', isInWatchlist(movie.id) && 'rotate-45 text-primary')}
            />
          </Button>
        </div>

        <Badge
          className="absolute top-3 left-3 bg-background/60"
          style={{ borderColor: getRatingColor(movie.vote_average) }}
        >
          <Star className="h-3 w-3 mr-1" fill="currentColor" />
          {formatRating(movie.vote_average)}
        </Badge>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1 group-hover:text-primary transition-colors duration-300">
          {movie.title}
        </h3>
        
        <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
          <Calendar className="h-3 w-3" />
          <span>{year || 'TBA'}</span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
          {truncateText(movie.overview, 100)}
        </p>
      </div>
    </Card>
  );
};

const MovieCard = React.memo(MovieCardComponent, (prevProps, nextProps) => {
  return (
    prevProps.movie.id === nextProps.movie.id &&
    prevProps.variant === nextProps.variant &&
    prevProps.className === nextProps.className &&
    prevProps.onClick === nextProps.onClick
  );
});

export const MovieCardSkeleton: React.FC = () => (
  <Card className="overflow-hidden">
    <Skeleton className="aspect-[2/3]" />
    <div className="p-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-1/3 mt-2" />
      <Skeleton className="h-12 w-full mt-3" />
    </div>
  </Card>
);

export default MovieCard;