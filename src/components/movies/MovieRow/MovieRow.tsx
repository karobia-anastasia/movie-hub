import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import MovieCard, { MovieCardSkeleton } from '../MovieCard/MovieCard';
import { Movie } from '@/types/movie';
import { cn } from '@/lib/utils';
import Loader from '@/components/common/Loader/Loader';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  loading?: boolean;
  onMovieClick?: (movie: Movie) => void;
  className?: string;
}

const MovieRow: React.FC<MovieRowProps> = ({
  title,
  movies,
  loading = false,
  onMovieClick,
  className,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 300;
      const currentScroll = scrollRef.current.scrollLeft;
      const targetScroll = direction === 'left' 
        ? currentScroll - scrollAmount 
        : currentScroll + scrollAmount;
      
      scrollRef.current.scrollTo({
        left: targetScroll,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className={cn('relative', className)}>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('left')}
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => scroll('right')}
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="relative">
   
        
        <div 
          ref={scrollRef}
          className="flex gap-3 sm:gap-4 pb-4 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]">
                <MovieCardSkeleton />
              </div>
            ))
          ) : (
            movies.map((movie) => (
              <div key={movie.id} className="flex-shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]">
                <MovieCard
                  movie={movie}
                  onClick={() => onMovieClick?.(movie)}
                  variant="compact"
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;