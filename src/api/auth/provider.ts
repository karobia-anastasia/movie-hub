import { User, LoginCredentials, RegisterCredentials, AuthResponse } from './types';

class AuthProvider {
  private readonly STORAGE_KEY = 'movie_app_auth';

  private getStoredAuth(): { user: User; token: string } | null {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private setStoredAuth(data: { user: User; token: string }): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data));
  }

  private clearStoredAuth(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    // Simulate API call - In production, this would call your backend
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password) {
          const user: User = {
            id: '1',
            email: credentials.email,
            name: credentials.email.split('@')[0],
            avatar: `https://ui-avatars.com/api/?name=${credentials.email.split('@')[0]}&background=e50914&color=fff`,
            createdAt: new Date(),
          };
          const token = 'mock_jwt_token_' + Date.now();
          const response = { user, token };
          this.setStoredAuth(response);
          resolve(response);
        } else {
          reject(new Error('Invalid credentials'));
        }
      }, 1000);
    });
  }

  async register(credentials: RegisterCredentials): Promise<AuthResponse> {
    // Simulate API call
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (credentials.email && credentials.password && credentials.name) {
          const user: User = {
            id: Date.now().toString(),
            email: credentials.email,
            name: credentials.name,
            avatar: `https://ui-avatars.com/api/?name=${credentials.name}&background=e50914&color=fff`,
            createdAt: new Date(),
          };
          const token = 'mock_jwt_token_' + Date.now();
          const response = { user, token };
          this.setStoredAuth(response);
          resolve(response);
        } else {
          reject(new Error('Invalid registration data'));
        }
      }, 1000);
    });
  }

  async logout(): Promise<void> {
    this.clearStoredAuth();
  }

  async getCurrentUser(): Promise<User | null> {
    const stored = this.getStoredAuth();
    return stored ? stored.user : null;
  }

  isAuthenticated(): boolean {
    return !!this.getStoredAuth();
  }
}

export const authProvider = new AuthProvider();