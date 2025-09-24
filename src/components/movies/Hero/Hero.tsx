// import React, { useEffect, useState } from 'react';
// import { Play, Info, Star } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Badge } from '@/components/ui/badge';
// import { Movie } from '@/types/movie';
// import { tmdbEndpoints } from '@/api/tmdb';
// import { formatRating, truncateText } from '@/utils/helpers';
// import { cn } from '@/lib/utils';

// interface HeroProps {
//   movie: Movie | null;
//   onPlayClick?: () => void;
//   onInfoClick?: () => void;
//   className?: string;
// }

// const Hero: React.FC<HeroProps> = ({ 
//   movie, 
//   onPlayClick,
//   onInfoClick,
//   className 
// }) => {
//   const [imageLoaded, setImageLoaded] = useState(false);

//   useEffect(() => {
//     setImageLoaded(false);
//   }, [movie]);

//   if (!movie) {
//     return (
//       <div className={cn('relative h-[70vh] bg-gradient-card', className)}>
//         <div className="absolute inset-0 animate-pulse bg-muted" />
//       </div>
//     );
//   }

//   const backdropUrl = tmdbEndpoints.utils.getImageUrl(movie.backdrop_path, 'original');

//   return (
//     <div className={cn('relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden', className)}>
//       {/* Background Image */}
//       <div className="absolute inset-0">
//         <img
//           src={backdropUrl}
//           alt={movie.title}
//           className={cn(
//             'w-full h-full object-cover transition-opacity duration-700',
//             imageLoaded ? 'opacity-100' : 'opacity-0'
//           )}
//           onLoad={() => setImageLoaded(true)}
//         />
//         <div className="absolute inset-0 bg-gradient-hero" />
//         <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
//       </div>

//       {/* Content */}
//       <div className="relative h-full flex items-end pb-20">
//         <div className="container mx-auto px-4">
//           <div className="max-w-2xl space-y-4">
//             {/* Title */}
//             <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
//               {movie.title}
//             </h1>

//             {/* Metadata */}
//             <div className="flex items-center gap-4 text-sm">
//               <Badge variant="secondary" className="px-3 py-1">
//                 <Star className="h-3 w-3 mr-1" fill="currentColor" />
//                 {formatRating(movie.vote_average)}
//               </Badge>
//               {movie.release_date && (
//                 <span className="text-muted-foreground">
//                   {new Date(movie.release_date).getFullYear()}
//                 </span>
//               )}
//               <span className="text-muted-foreground">
//                 {movie.vote_count.toLocaleString()} votes
//               </span>
//             </div>

//             {/* Overview */}
//             <p className="text-lg text-foreground/90 max-w-xl">
//               {truncateText(movie.overview, 200)}
//             </p>

//             {/* Actions */}
//             <div className="flex gap-3 pt-2">
//               <Button 
//                 size="lg" 
//                 onClick={onPlayClick}
//                 className="bg-primary hover:bg-primary-glow text-primary-foreground"
//               >
//                 <Play className="h-5 w-5 mr-2" fill="currentColor" />
//                 Play Trailer
//               </Button>
//               <Button 
//                 size="lg" 
//                 variant="secondary"
//                 onClick={onInfoClick}
//                 className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
//               >
//                 <Info className="h-5 w-5 mr-2" />
//                 More Info
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Hero;


import React, { useEffect, useState } from 'react';
import { Play, Info, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Movie } from '@/types/movie';
import { tmdbEndpoints } from '@/api/tmdb';
import { formatRating, truncateText } from '@/utils/helpers';
import { cn } from '@/lib/utils';

interface HeroProps {
  movie: Movie | null;
  onPlayClick?: () => void;
  onInfoClick?: () => void;
  className?: string;
}

const Hero: React.FC<HeroProps> = ({ 
  movie, 
  onPlayClick,
  onInfoClick,
  className 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    setImageLoaded(false);
  }, [movie]);

  if (!movie) {
    return (
      <div className={cn('relative h-[70vh] bg-gradient-card', className)}>
        <div className="absolute inset-0 animate-pulse bg-muted" />
      </div>
    );
  }

  const backdropUrl = tmdbEndpoints.utils.getImageUrl(movie.backdrop_path, 'original');

  return (
    <div className={cn('relative h-[50vh] sm:h-[60vh] md:h-[70vh] overflow-hidden', className)}>
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={backdropUrl}
          alt={movie.title}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-700',
            imageLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={() => setImageLoaded(true)}
        />
        {/* Overlay only on the left side for readability */}
        <div className="absolute inset-y-0 left-0 w-2/3 bg-gradient-to-r from-background/90 via-background/60 to-transparent dark:from-background dark:via-background/40 dark:to-transparent" />
        {/* Optional bottom fade */}
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/60 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-end pb-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl space-y-4">
            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              {movie.title}
            </h1>

            {/* Metadata */}
            <div className="flex items-center gap-4 text-sm">
              <Badge variant="secondary" className="px-3 py-1">
                <Star className="h-3 w-3 mr-1" fill="currentColor" />
                {formatRating(movie.vote_average)}
              </Badge>
              {movie.release_date && (
                <span className="text-muted-foreground">
                  {new Date(movie.release_date).getFullYear()}
                </span>
              )}
              <span className="text-muted-foreground">
                {movie.vote_count.toLocaleString()} votes
              </span>
            </div>

            {/* Overview */}
            <p className="text-lg text-foreground max-w-xl dark:text-foreground/90">
              {truncateText(movie.overview, 200)}
            </p>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <Button 
                size="lg" 
                onClick={onPlayClick}
                className="bg-primary hover:bg-primary-glow text-primary-foreground"
              >
                <Play className="h-5 w-5 mr-2" fill="currentColor" />
                Play Trailer
              </Button>
              <Button 
                size="lg" 
                variant="secondary"
                onClick={onInfoClick}
                className="bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm"
              >
                <Info className="h-5 w-5 mr-2" />
                More Info
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
