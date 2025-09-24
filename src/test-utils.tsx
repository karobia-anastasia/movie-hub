import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { MovieProvider } from '@/contexts/MovieContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export function renderWithProviders(
  ui: React.ReactElement,
  options = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <MovieProvider>
              {children}
            </MovieProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    );
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';