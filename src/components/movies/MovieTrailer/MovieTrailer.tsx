import React, { useState, useEffect } from 'react';
import { X, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { tmdbEndpoints } from '@/api/tmdb';

interface MovieTrailerProps {
  movieId: number | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

const MovieTrailer: React.FC<MovieTrailerProps> = ({ movieId, open, onOpenChange }) => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (movieId && open) {
      fetchVideos();
    }
  }, [movieId, open]);

  const fetchVideos = async () => {
    if (!movieId) return;
    
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.themoviedb.org/3/movie/${movieId}/videos`,
        {
          headers: {
            'Authorization': `Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhOTgzZGM0MWYzZGZkYmFjOThjYzU4OGRhZDBlZDhmNSIsIm5iZiI6MTU3MDc4MjUwMS42OCwic3ViIjoiNWRhMDNkMjU0YTIyMjYwMDFmZTA1YWRjIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.9lCRAY9IOv4rKH1wU6z_ZecLagvmxdYL5taWAClPrqY`,
            'accept': 'application/json'
          }
        }
      );
      const data = await response.json();
      
      const youtubeVideos = data.results.filter((v: Video) => v.site === 'YouTube');
      setVideos(youtubeVideos);
      
      // Select first trailer or first video
      const trailer = youtubeVideos.find((v: Video) => v.type === 'Trailer') || youtubeVideos[0];
      setSelectedVideo(trailer);
    } catch (error) {
      console.error('Failed to fetch videos:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!selectedVideo) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl p-0">
        <DialogTitle className="sr-only">Movie Trailer</DialogTitle>
        <div className="flex items-center justify-center h-96">
          <p className="text-muted-foreground">No trailer available</p>
        </div>
      </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
    <DialogContent className="max-w-5xl p-0 overflow-hidden bg-black">
      <DialogTitle className="sr-only">Movie Trailer</DialogTitle>
      <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 z-50 bg-background/80 backdrop-blur-sm hover:bg-background/90"
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="aspect-video">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${selectedVideo.key}?autoplay=1&rel=0&modestbranding=1`}
              title={selectedVideo.name}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            />
          </div>

          {videos.length > 1 && (
            <div className="p-4 bg-background border-t">
              <h3 className="text-sm font-medium mb-2">Other Videos</h3>
              <div className="flex gap-2 overflow-x-auto">
                {videos.map((video) => (
                  <Button
                    key={video.id}
                    variant={selectedVideo?.id === video.id ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedVideo(video)}
                    className="flex-shrink-0"
                  >
                    <Play className="h-3 w-3 mr-1" />
                    {video.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MovieTrailer;