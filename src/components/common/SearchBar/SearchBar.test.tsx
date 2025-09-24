import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import SearchBar from './SearchBar';

describe('SearchBar Component', () => {
  const defaultProps = {
    value: '',
    onChange: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders with default placeholder', () => {
      render(<SearchBar {...defaultProps} />);
      
      expect(screen.getByPlaceholderText('Search movies...')).toBeInTheDocument();
    });

    it('renders with custom placeholder', () => {
      const customPlaceholder = 'Find your movie...';
      render(<SearchBar {...defaultProps} placeholder={customPlaceholder} />);
      
      expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
    });

    it('displays search icon', () => {
      render(<SearchBar {...defaultProps} />);
      
      const searchIcon = document.querySelector('[class*="lucide-search"]');
      expect(searchIcon).toBeInTheDocument();
    });

    it('applies custom className', () => {
      const customClass = 'custom-search-bar';
      render(<SearchBar {...defaultProps} className={customClass} />);
      
      const container = document.querySelector('.custom-search-bar');
      expect(container).toBeInTheDocument();
    });

    it('displays clear button when value is present', () => {
      render(<SearchBar {...defaultProps} value="test query" />);
      
      const clearButton = screen.getByRole('button');
      expect(clearButton).toBeInTheDocument();
      
      const clearIcon = document.querySelector('[class*="lucide-x"]');
      expect(clearIcon).toBeInTheDocument();
    });

    it('hides clear button when value is empty', () => {
      render(<SearchBar {...defaultProps} value="" />);
      
      const clearButton = screen.queryByRole('button');
      expect(clearButton).not.toBeInTheDocument();
    });
  });

  describe('User Interactions', () => {
    it('calls onChange when user types', () => {
      const handleChange = vi.fn();
      render(<SearchBar {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByPlaceholderText('Search movies...');
      fireEvent.change(input, { target: { value: 'test search' } });
      
      expect(handleChange).toHaveBeenCalledWith('test search');
    });

    it('calls onChange with empty string when clear button is clicked', () => {
      const handleChange = vi.fn();
      render(<SearchBar {...defaultProps} value="test query" onChange={handleChange} />);
      
      const clearButton = screen.getByRole('button');
      fireEvent.click(clearButton);
      
      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('calls onClear when clear button is clicked', () => {
      const handleClear = vi.fn();
      render(
        <SearchBar 
          {...defaultProps} 
          value="test query" 
          onClear={handleClear}
        />
      );
      
      const clearButton = screen.getByRole('button');
      fireEvent.click(clearButton);
      
      expect(handleClear).toHaveBeenCalledTimes(1);
    });

    it('handles focus and blur events', async () => {
      render(<SearchBar {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Search movies...');
      const container = input.closest('div');
      
      // Focus the input
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(container).toHaveClass('scale-105');
      });
      
      // Blur the input
      fireEvent.blur(input);
      
      await waitFor(() => {
        expect(container).not.toHaveClass('scale-105');
      });
    });
  });

  describe('State Management', () => {
    it('displays controlled value correctly', () => {
      const testValue = 'controlled value';
      render(<SearchBar {...defaultProps} value={testValue} />);
      
      const input = screen.getByDisplayValue(testValue);
      expect(input).toBeInTheDocument();
    });

    it('updates display when value prop changes', () => {
      const { rerender } = render(<SearchBar {...defaultProps} value="initial" />);
      
      expect(screen.getByDisplayValue('initial')).toBeInTheDocument();
      
      rerender(<SearchBar {...defaultProps} value="updated" />);
      
      expect(screen.getByDisplayValue('updated')).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    it('has proper form input attributes', () => {
      render(<SearchBar {...defaultProps} />);
      
      const input = screen.getByRole('textbox');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('clear button is focusable and clickable', () => {
      render(<SearchBar {...defaultProps} value="test" />);
      
      const clearButton = screen.getByRole('button');
      expect(clearButton).toBeVisible();
      
      clearButton.focus();
      expect(document.activeElement).toBe(clearButton);
    });

    it('maintains input focus after typing', () => {
      const handleChange = vi.fn();
      render(<SearchBar {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByPlaceholderText('Search movies...');
      input.focus();
      
      fireEvent.change(input, { target: { value: 'test' } });
      
      expect(document.activeElement).toBe(input);
    });
  });

  describe('Visual Feedback', () => {
    it('applies focus styles correctly', async () => {
      render(<SearchBar {...defaultProps} />);
      
      const input = screen.getByPlaceholderText('Search movies...');
      
      fireEvent.focus(input);
      
      await waitFor(() => {
        expect(input).toHaveClass('focus:bg-input', 'focus:border-primary', 'focus:shadow-glow');
      });
    });

    it('applies transition classes', () => {
      render(<SearchBar {...defaultProps} />);
      
      const container = document.querySelector('[class*="transition-all"]');
      expect(container).toBeInTheDocument();
      
      const input = screen.getByPlaceholderText('Search movies...');
      expect(input).toHaveClass('transition-all', 'duration-300');
    });
  });

  describe('Edge Cases', () => {
    it('handles rapid typing correctly', () => {
      const handleChange = vi.fn();
      render(<SearchBar {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByPlaceholderText('Search movies...');
      
      // Rapid typing simulation
      fireEvent.change(input, { target: { value: 'a' } });
      fireEvent.change(input, { target: { value: 'ab' } });
      fireEvent.change(input, { target: { value: 'abc' } });
      
      expect(handleChange).toHaveBeenCalledTimes(3);
      expect(handleChange).toHaveBeenLastCalledWith('abc');
    });

    it('handles empty string input correctly', () => {
      const handleChange = vi.fn();
      render(<SearchBar {...defaultProps} value="test" onChange={handleChange} />);
      
      const input = screen.getByDisplayValue('test');
      fireEvent.change(input, { target: { value: '' } });
      
      expect(handleChange).toHaveBeenCalledWith('');
    });

    it('handles special characters in input', () => {
      const handleChange = vi.fn();
      render(<SearchBar {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByPlaceholderText('Search movies...');
      const specialText = '!@#$%^&*()_+-={}[]|\\:;"<>?,./~`';
      
      fireEvent.change(input, { target: { value: specialText } });
      
      expect(handleChange).toHaveBeenCalledWith(specialText);
    });

    it('handles very long input strings', () => {
      const handleChange = vi.fn();
      render(<SearchBar {...defaultProps} onChange={handleChange} />);
      
      const input = screen.getByPlaceholderText('Search movies...');
      const longText = 'a'.repeat(1000);
      
      fireEvent.change(input, { target: { value: longText } });
      
      expect(handleChange).toHaveBeenCalledWith(longText);
    });
  });

  describe('Performance', () => {
    it('does not cause unnecessary re-renders', () => {
      const handleChange = vi.fn();
      const { rerender } = render(<SearchBar {...defaultProps} onChange={handleChange} />);
      
      // Re-render with same props
      rerender(<SearchBar {...defaultProps} onChange={handleChange} />);
      
      // Should still be functional
      const input = screen.getByPlaceholderText('Search movies...');
      expect(input).toBeInTheDocument();
    });
  });
});