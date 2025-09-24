import React, { useEffect, useState } from 'react';
import { X, Star, Calendar, Clock, DollarSign, TrendingUp, Users, Film } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { MovieDetails, Credits } from '@/types/movie';
import { tmdbEndpoints } from '@/api/tmdb';
import { formatDate, formatCurrency, formatRuntime, formatRating } from '@/utils/helpers';
import { getRatingColor } from '@/utils/constants';
import Loader from '@/components/common/Loader/Loader';

interface MovieDetailsDialogProps {
  movieId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MovieDetailsDialog: React.FC<MovieDetailsDialogProps> = ({
  movieId,
  open,
  onOpenChange,
}) => {
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [credits, setCredits] = useState<Credits | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movieId && open) {
      fetchMovieDetails();
    }
  }, [movieId, open]);

  const fetchMovieDetails = async () => {
    if (!movieId) return;
    
    setLoading(true);
    try {
      const [movieData, creditsData] = await Promise.all([
        tmdbEndpoints.movies.details(movieId),
        tmdbEndpoints.movies.credits(movieId),
      ]);
      setMovie(movieData);
      setCredits(creditsData);
    } catch (error) {
      console.error('Failed to fetch movie details:', error);
    } finally {
      setLoading(false);
    }
  };

  const backdropUrl = movie ? tmdbEndpoints.utils.getImageUrl(movie.backdrop_path, 'original') : '';
  const posterUrl = movie ? tmdbEndpoints.utils.getImageUrl(movie.poster_path, 'w500') : '';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <Loader size="lg" />
          </div>
        ) : movie ? (
          <ScrollArea className="h-full">
            {/* Hero Section */}
            <div className="relative h-[400px]">
              <img
                src={backdropUrl}
                alt={movie.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
              
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="absolute top-4 right-4 bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <X className="h-5 w-5" />
              </Button>

              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex gap-6">
                  <img
                    src={posterUrl}
                    alt={movie.title}
                    className="w-32 rounded-lg shadow-xl"
                  />
                  <div className="flex-1 space-y-3">
                    <h2 className="text-4xl font-bold">{movie.title}</h2>
                    {movie.tagline && (
                      <p className="text-lg text-muted-foreground italic">"{movie.tagline}"</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      {movie.genres?.map((genre) => (
                        <Badge key={genre.id} variant="secondary">
                          {genre.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-8">
              <Tabs defaultValue="overview" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="cast">Cast & Crew</TabsTrigger>
                  <TabsTrigger value="details">Details</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6 mt-6">
                  <div>
                    <h3 className="text-xl font-semibold mb-3">Synopsis</h3>
                    <p className="text-muted-foreground leading-relaxed">{movie.overview}</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard
                      icon={<Star className="h-5 w-5" />}
                      label="Rating"
                      value={formatRating(movie.vote_average)}
                      color={getRatingColor(movie.vote_average)}
                    />
                    <StatCard
                      icon={<Calendar className="h-5 w-5" />}
                      label="Release Date"
                      value={formatDate(movie.release_date)}
                    />
                    {movie.runtime && (
                      <StatCard
                        icon={<Clock className="h-5 w-5" />}
                        label="Runtime"
                        value={formatRuntime(movie.runtime)}
                      />
                    )}
                    <StatCard
                      icon={<TrendingUp className="h-5 w-5" />}
                      label="Popularity"
                      value={movie.popularity.toFixed(0)}
                    />
                  </div>
                </TabsContent>

                <TabsContent value="cast" className="mt-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Cast</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {credits?.cast.slice(0, 12).map((actor) => (
                          <CastCard key={actor.id} person={actor} type="cast" />
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-xl font-semibold mb-4">Crew</h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {credits?.crew
                          .filter((person) => 
                            ['Director', 'Producer', 'Screenplay', 'Writer'].includes(person.job)
                          )
                          .slice(0, 6)
                          .map((person) => (
                            <CastCard key={`${person.id}-${person.job}`} person={person} type="crew" />
                          ))}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="details" className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DetailItem label="Status" value={movie.status || 'N/A'} />
                    <DetailItem 
                      label="Original Language" 
                      value={movie.original_language?.toUpperCase() || 'N/A'} 
                    />
                    {movie.budget > 0 && (
                      <DetailItem label="Budget" value={formatCurrency(movie.budget)} />
                    )}
                    {movie.revenue > 0 && (
                      <DetailItem label="Revenue" value={formatCurrency(movie.revenue)} />
                    )}
                    <DetailItem 
                      label="Vote Count" 
                      value={movie.vote_count.toLocaleString()} 
                    />
                    {movie.production_companies && movie.production_companies.length > 0 && (
                      <div className="col-span-2">
                        <DetailItem 
                          label="Production Companies" 
                          value={movie.production_companies.map(c => c.name).join(', ')} 
                        />
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </ScrollArea>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

const StatCard: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}> = ({ icon, label, value, color }) => (
  <div className="bg-card p-4 rounded-lg border">
    <div className="flex items-center gap-2 text-muted-foreground mb-1">
      {icon}
      <span className="text-sm">{label}</span>
    </div>
    <p className="text-2xl font-bold" style={{ color }}>{value}</p>
  </div>
);

const CastCard: React.FC<{
  person: any;
  type: 'cast' | 'crew';
}> = ({ person, type }) => {
  const imageUrl = tmdbEndpoints.utils.getImageUrl(person.profile_path, 'w200');
  
  return (
    <div className="flex gap-3 p-3 bg-card rounded-lg border">
      <img
        src={imageUrl}
        alt={person.name}
        className="w-12 h-12 rounded-full object-cover"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium truncate">{person.name}</p>
        <p className="text-sm text-muted-foreground truncate">
          {type === 'cast' ? person.character : person.job}
        </p>
      </div>
    </div>
  );
};

const DetailItem: React.FC<{
  label: string;
  value: string;
}> = ({ label, value }) => (
  <div>
    <p className="text-sm text-muted-foreground mb-1">{label}</p>
    <p className="font-medium">{value}</p>
  </div>
);

export default MovieDetailsDialog;
