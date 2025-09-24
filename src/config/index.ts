interface AppConfig {
  tmdb: {
    apiBaseUrl: string;
    accessToken: string;
    imageBaseUrl: string;
    timeout: number;
  };
  cache: {
    defaultTimeout: number;
    searchTimeout: number;
    detailsTimeout: number;
    listsTimeout: number;
  };
}

class ConfigService {
  private static instance: ConfigService;
  private config: AppConfig;

  private constructor() {
    this.config = this.loadConfig();
    this.validateConfig();
  }

  public static getInstance(): ConfigService {
    if (!ConfigService.instance) {
      ConfigService.instance = new ConfigService();
    }
    return ConfigService.instance;
  }

  private loadConfig(): AppConfig {
    return {
      tmdb: {
        apiBaseUrl: this.getRequiredEnvVar('VITE_TMDB_API_BASE_URL'),
        accessToken: this.getRequiredEnvVar('VITE_TMDB_ACCESS_TOKEN'),
        imageBaseUrl: this.getRequiredEnvVar('VITE_TMDB_IMAGE_BASE_URL'),
        timeout: parseInt(this.getEnvVar('VITE_API_TIMEOUT', '10000'), 10),
      },
      cache: {
        defaultTimeout: parseInt(this.getEnvVar('VITE_CACHE_TIMEOUT', '300000'), 10), // 5 minutes
        searchTimeout: parseInt(this.getEnvVar('VITE_CACHE_SEARCH_TIMEOUT', '120000'), 10), // 2 minutes
        detailsTimeout: parseInt(this.getEnvVar('VITE_CACHE_DETAILS_TIMEOUT', '900000'), 10), // 15 minutes
        listsTimeout: parseInt(this.getEnvVar('VITE_CACHE_LISTS_TIMEOUT', '300000'), 10), // 5 minutes
      },
    };
  }

  private getRequiredEnvVar(name: string): string {
    const value = import.meta.env[name];
    if (!value || value.trim() === '') {
      throw new Error(
        `Missing required environment variable: ${name}. ` +
        `Please check your .env file and ensure ${name} is properly set.`
      );
    }
    return value.trim();
  }

  private getEnvVar(name: string, defaultValue: string): string {
    const value = import.meta.env[name];
    return value && value.trim() !== '' ? value.trim() : defaultValue;
  }

  private validateConfig(): void {
    // Validate API base URL format
    try {
      new URL(this.config.tmdb.apiBaseUrl);
    } catch {
      throw new Error(
        `Invalid TMDB API base URL: ${this.config.tmdb.apiBaseUrl}. ` +
        `Please provide a valid URL format (e.g., https://api.themoviedb.org/3)`
      );
    }

    // Validate image base URL format
    try {
      new URL(this.config.tmdb.imageBaseUrl);
    } catch {
      throw new Error(
        `Invalid TMDB image base URL: ${this.config.tmdb.imageBaseUrl}. ` +
        `Please provide a valid URL format (e.g., https://image.tmdb.org/t/p)`
      );
    }

    // Validate access token format (should be a JWT-like string)
    if (this.config.tmdb.accessToken.length < 10) {
      throw new Error(
        `Invalid TMDB access token format. ` +
        `Please ensure you have a valid TMDB API access token.`
      );
    }

    // Validate timeout values
    if (this.config.tmdb.timeout < 1000 || this.config.tmdb.timeout > 60000) {
      throw new Error(
        `Invalid API timeout value: ${this.config.tmdb.timeout}ms. ` +
        `Timeout should be between 1000ms and 60000ms.`
      );
    }
  }

  // Public getters for configuration values
  public getTmdbApiBaseUrl(): string {
    return this.config.tmdb.apiBaseUrl;
  }

  public getTmdbAccessToken(): string {
    return this.config.tmdb.accessToken;
  }

  public getTmdbImageBaseUrl(): string {
    return this.config.tmdb.imageBaseUrl;
  }

  public getApiTimeout(): number {
    return this.config.tmdb.timeout;
  }

  public getCacheTimeout(type: 'default' | 'search' | 'details' | 'lists' = 'default'): number {
    switch (type) {
      case 'search':
        return this.config.cache.searchTimeout;
      case 'details':
        return this.config.cache.detailsTimeout;
      case 'lists':
        return this.config.cache.listsTimeout;
      default:
        return this.config.cache.defaultTimeout;
    }
  }

  public getAuthHeaders(): HeadersInit {
    return {
      'Authorization': `Bearer ${this.config.tmdb.accessToken}`,
      'accept': 'application/json',
    };
  }

  public getImageUrl(path: string | null, size: 'w200' | 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
    if (!path) return '/placeholder.svg';
    return `${this.config.tmdb.imageBaseUrl}/${size}${path}`;
  }

  // Development helper method
  public getConfigSummary(): Partial<AppConfig> {
    return {
      tmdb: {
        apiBaseUrl: this.config.tmdb.apiBaseUrl,
        imageBaseUrl: this.config.tmdb.imageBaseUrl,
        timeout: this.config.tmdb.timeout,
        accessToken: this.config.tmdb.accessToken ? '[SET]' : '[NOT SET]',
      },
      cache: this.config.cache,
    };
  }
}

// Export singleton instance
export const configService = ConfigService.getInstance();

// Export types for testing and development
export type { AppConfig };