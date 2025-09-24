import React from 'react';
import { cn } from '@/lib/utils';
import { Film } from 'lucide-react';

interface LoaderProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  fullScreen?: boolean;
  variant?: 'spinner' | 'dots' | 'film';
}

const Loader: React.FC<LoaderProps> = ({ 
  className, 
  size = 'md',
  fullScreen = false,
  variant = 'film'
}) => {
  const sizeClasses = {
    sm: { container: 'scale-75', icon: 'h-8 w-8' },
    md: { container: 'scale-100', icon: 'h-12 w-12' },
    lg: { container: 'scale-125', icon: 'h-16 w-16' },
  };

  const renderLoader = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={cn('relative', sizeClasses[size].container)}>
            <div className="relative h-12 w-12">
              <div className="absolute inset-0 rounded-full border-4 border-primary/20" />
              <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-primary" />
            </div>
          </div>
        );
      
      case 'dots':
        return (
          <div className={cn('flex items-center gap-1', sizeClasses[size].container)}>
            <span className="inline-block h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
            <span className="inline-block h-3 w-3 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
            <span className="inline-block h-3 w-3 animate-bounce rounded-full bg-primary" />
          </div>
        );
      
      case 'film':
      default:
        return (
          <div className={cn('relative', sizeClasses[size].container)}>
            <div className="relative">
              <Film className={cn(
                'animate-pulse text-primary',
                sizeClasses[size].icon
              )} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-full w-full animate-ping rounded-full bg-primary/20" />
              </div>
            </div>
            <div className="mt-3 flex justify-center gap-1">
              <span className="inline-block h-1 w-8 animate-pulse rounded-full bg-primary/60" />
              <span className="inline-block h-1 w-8 animate-pulse rounded-full bg-primary/40 [animation-delay:0.2s]" />
              <span className="inline-block h-1 w-8 animate-pulse rounded-full bg-primary/20 [animation-delay:0.4s]" />
            </div>
          </div>
        );
    }
  };

  const loader = (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      {renderLoader()}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/90 backdrop-blur-sm">
        {loader}
      </div>
    );
  }

  return loader;
};

export default Loader;

