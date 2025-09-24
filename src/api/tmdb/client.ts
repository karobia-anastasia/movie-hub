import { MovieResponse, MovieDetails, Credits, TMDBConfig } from './types';
import { configService } from '@/config';

class TMDBClient {
  private headers: HeadersInit;
  private cache = new Map<string, { data: any; timestamp: number }>();
  private apiBaseUrl: string;
  private timeout: number;

  constructor() {
    this.headers = configService.getAuthHeaders();
    this.apiBaseUrl = configService.getTmdbApiBaseUrl();
    this.timeout = configService.getApiTimeout();
  }

  private async fetchWithCache<T>(url: string, cacheType: 'search' | 'details' | 'lists' = 'lists'): Promise<T> {
    const cacheKey = url;
    const cached = this.cache.get(cacheKey);
    const cacheTimeout = configService.getCacheTimeout(cacheType);
    
    if (cached && Date.now() - cached.timestamp < cacheTimeout) {
      return cached.data;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);
      
      const response = await fetch(url, { 
        headers: this.headers,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`TMDB API Error: ${response.status}`);
      }
      const data = await response.json();
      
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      return data;
    } catch (error) {
      if (error.name === 'AbortError') {
        throw new Error('Request timeout');
      }
      console.error('TMDB API Error:', error);
      throw error;
    }
  }

  async getConfiguration(): Promise<TMDBConfig> {
    return this.fetchWithCache<TMDBConfig>(`${this.apiBaseUrl}/configuration`);
  }

  async getPopularMovies(page = 1): Promise<MovieResponse> {
    return this.fetchWithCache<MovieResponse>(
      `${this.apiBaseUrl}/movie/popular?page=${page}`
    );
  }

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week', page = 1): Promise<MovieResponse> {
    return this.fetchWithCache<MovieResponse>(
      `${this.apiBaseUrl}/trending/movie/${timeWindow}?page=${page}`
    );
  }

  async getTopRatedMovies(page = 1): Promise<MovieResponse> {
    return this.fetchWithCache<MovieResponse>(
      `${this.apiBaseUrl}/movie/top_rated?page=${page}`
    );
  }

  async getNowPlayingMovies(page = 1): Promise<MovieResponse> {
    return this.fetchWithCache<MovieResponse>(
      `${this.apiBaseUrl}/movie/now_playing?page=${page}`
    );
  }

  async getUpcomingMovies(page = 1): Promise<MovieResponse> {
    return this.fetchWithCache<MovieResponse>(
      `${this.apiBaseUrl}/movie/upcoming?page=${page}`
    );
  }

  async searchMovies(query: string, page = 1): Promise<MovieResponse> {
    const encodedQuery = encodeURIComponent(query);
    return this.fetchWithCache<MovieResponse>(
      `${this.apiBaseUrl}/search/movie?query=${encodedQuery}&page=${page}`,
      'search'
    );
  }

  async getMovieDetails(movieId: number): Promise<MovieDetails> {
    return this.fetchWithCache<MovieDetails>(
      `${this.apiBaseUrl}/movie/${movieId}`,
      'details'
    );
  }

  async getMovieCredits(movieId: number): Promise<Credits> {
    return this.fetchWithCache<Credits>(
      `${this.apiBaseUrl}/movie/${movieId}/credits`
    );
  }

  async getSimilarMovies(movieId: number, page = 1): Promise<MovieResponse> {
    return this.fetchWithCache<MovieResponse>(
      `${this.apiBaseUrl}/movie/${movieId}/similar?page=${page}`
    );
  }

  async getRecommendedMovies(movieId: number, page = 1): Promise<MovieResponse> {
    return this.fetchWithCache<MovieResponse>(
      `${this.apiBaseUrl}/movie/${movieId}/recommendations?page=${page}`
    );
  }

  getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
    return configService.getImageUrl(path, size);
  }

  async getMovieVideos(movieId: number): Promise<{ results: any[] }> {
    return this.fetchWithCache<{ results: any[] }>(
      `${this.apiBaseUrl}/movie/${movieId}/videos`
    );
  }

  clearCache(): void {
    this.cache.clear();
  }
}

export const tmdbClient = new TMDBClient();