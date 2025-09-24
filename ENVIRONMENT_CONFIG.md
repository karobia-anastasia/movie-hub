# Environment Configuration Guide

## Overview

This MovieHub application uses environment variables to manage API credentials and configuration settings. This approach enhances security by keeping sensitive information out of the source code and allows for different configurations across environments.

## Required Environment Variables

Create a `.env.local` file in the project root with the following variables:

```bash
# TMDB API Configuration (Required)
VITE_TMDB_API_BASE_URL=https://api.themoviedb.org/3
VITE_TMDB_ACCESS_TOKEN=your_tmdb_access_token_here
VITE_TMDB_IMAGE_BASE_URL=https://image.tmdb.org/t/p

# Optional Configuration
VITE_API_TIMEOUT=10000
VITE_CACHE_TIMEOUT=300000
VITE_CACHE_SEARCH_TIMEOUT=120000
VITE_CACHE_DETAILS_TIMEOUT=900000
VITE_CACHE_LISTS_TIMEOUT=300000
```

## Getting Your TMDB API Token

1. Create an account at [The Movie Database (TMDB)](https://www.themoviedb.org/)
2. Go to your [Account Settings](https://www.themoviedb.org/settings/api)
3. Request an API key
4. Once approved, copy your **Access Token (v4 auth)** or **API Key (v3 auth)**
5. Add it to your `.env.local` file as `VITE_TMDB_ACCESS_TOKEN`

## Environment Files

- `.env.example` - Template file with placeholder values (committed to git)
- `.env.local` - Your local development environment variables (ignored by git)
- `.env.production` - Production environment variables (set in deployment platform)

## Configuration Service

The application uses a centralized configuration service (`src/config/index.ts`) that:

- Validates all required environment variables at startup
- Provides type-safe access to configuration values
- Handles default values for optional settings
- Throws descriptive errors for missing or invalid configuration

## Usage Examples

```typescript
import { configService } from '@/config';

// Get API base URL
const apiUrl = configService.getTmdbApiBaseUrl();

// Get authentication headers
const headers = configService.getAuthHeaders();

// Generate image URLs
const imageUrl = configService.getImageUrl('/poster.jpg', 'w500');

// Get cache timeouts
const cacheTimeout = configService.getCacheTimeout('search');
```

## Development Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and replace placeholder values with your actual TMDB API credentials

3. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

For production deployments, set environment variables through your hosting platform:

### Vercel
1. Go to your project settings
2. Navigate to "Environment Variables"
3. Add each variable with appropriate values

### Netlify
1. Go to Site settings > Environment variables
2. Add each required variable

### Other Platforms
Refer to your platform's documentation for setting environment variables.

## Security Best Practices

1. **Never commit sensitive tokens to version control**
2. **Use different API keys for different environments**
3. **Regularly rotate API tokens**
4. **Limit API key permissions to only what's needed**
5. **Monitor API usage for unusual activity**

## Troubleshooting

### Missing Environment Variable Error
```
Error: Missing required environment variable: VITE_TMDB_ACCESS_TOKEN
```
**Solution**: Ensure the variable is set in your `.env.local` file with a valid value.

### Invalid URL Format Error
```
Error: Invalid TMDB API base URL: invalid-url
```
**Solution**: Ensure URLs start with `http://` or `https://` and are properly formatted.

### API Authentication Errors
If you receive 401 Unauthorized errors:
1. Verify your API token is correct
2. Check if the token has expired
3. Ensure you're using the correct token type (v3 API key vs v4 access token)

## Migration from Hardcoded Values

This application has been migrated from hardcoded API credentials to environment variables. The following changes were made:

1. **Created configuration service** - Centralized environment variable management
2. **Updated TMDB client** - Now uses configuration service for API calls
3. **Refactored components** - MovieTrailer component now uses centralized client
4. **Updated constants** - Image URLs now generated dynamically
5. **Enhanced testing** - Tests work with both mocked and real configuration

## Configuration Validation

The application validates configuration at startup and will fail fast with descriptive error messages if:
- Required environment variables are missing
- URL formats are invalid
- Timeout values are out of reasonable ranges
- API tokens appear to be malformed

This ensures issues are caught early rather than causing runtime failures.