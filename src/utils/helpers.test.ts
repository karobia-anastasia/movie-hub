import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  formatDate,
  formatCurrency,
  formatRuntime,
  truncateText,
  debounce,
  formatRating,
  getYearFromDate,
} from './helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    it('formats valid date strings correctly', () => {
      expect(formatDate('2023-01-15')).toBe('January 15, 2023');
      expect(formatDate('2023-12-31')).toBe('December 31, 2023');
      expect(formatDate('2023-06-01')).toBe('June 1, 2023');
    });

    it('handles empty or invalid date strings', () => {
      expect(formatDate('')).toBe('TBA');
      expect(formatDate('invalid-date')).toBe('Invalid Date');
      expect(formatDate('2023-13-45')).toBe('Invalid Date');
    });

    it('handles edge case dates', () => {
      expect(formatDate('2000-02-29')).toBe('February 29, 2000'); // Leap year
      expect(formatDate('1999-02-28')).toBe('February 28, 1999'); // Non-leap year
    });
  });

  describe('formatCurrency', () => {
    it('formats standard amounts correctly', () => {
      expect(formatCurrency(1000000)).toBe('$1,000,000');
      expect(formatCurrency(150000)).toBe('$150,000');
      expect(formatCurrency(500)).toBe('$500');
      expect(formatCurrency(0)).toBe('$0');
    });

    it('handles negative amounts', () => {
      expect(formatCurrency(-1000000)).toBe('-$1,000,000');
      expect(formatCurrency(-500)).toBe('-$500');
    });

    it('handles decimal precision correctly', () => {
      expect(formatCurrency(1000.50)).toBe('$1,001'); // Rounds to nearest dollar
      expect(formatCurrency(999.49)).toBe('$999');
      expect(formatCurrency(999.51)).toBe('$1,000');
    });

    it('handles very large numbers', () => {
      expect(formatCurrency(1000000000)).toBe('$1,000,000,000');
      expect(formatCurrency(999999999.99)).toBe('$1,000,000,000');
    });
  });

  describe('formatRuntime', () => {
    it('formats standard runtime correctly', () => {
      expect(formatRuntime(90)).toBe('1h 30m');
      expect(formatRuntime(120)).toBe('2h 0m');
      expect(formatRuntime(45)).toBe('0h 45m');
      expect(formatRuntime(180)).toBe('3h 0m');
    });

    it('handles edge cases', () => {
      expect(formatRuntime(0)).toBe('0h 0m');
      expect(formatRuntime(1)).toBe('0h 1m');
      expect(formatRuntime(59)).toBe('0h 59m');
      expect(formatRuntime(60)).toBe('1h 0m');
    });

    it('handles very long runtimes', () => {
      expect(formatRuntime(600)).toBe('10h 0m');
      expect(formatRuntime(1440)).toBe('24h 0m'); // Full day
    });

    it('handles decimal minutes (should floor)', () => {
      expect(formatRuntime(90.9)).toBe('1h 30m');
      expect(formatRuntime(119.9)).toBe('1h 59m');
    });
  });

  describe('truncateText', () => {
    it('truncates text longer than maxLength', () => {
      const longText = 'This is a very long text that needs to be truncated';
      expect(truncateText(longText, 20)).toBe('This is a very lo...');
      expect(truncateText(longText, 10)).toBe('This is...');
      expect(truncateText(longText, 5)).toBe('Th...');
    });

    it('returns original text if shorter than maxLength', () => {
      expect(truncateText('Short', 20)).toBe('Short');
      expect(truncateText('Exact length', 12)).toBe('Exact length');
    });

    it('handles edge cases', () => {
      expect(truncateText('', 20)).toBe('');
      expect(truncateText('Test', 4)).toBe('Test'); // Exact length
      expect(truncateText('Test', 3)).toBe('...');
      expect(truncateText('Test', 2)).toBe('...');
      expect(truncateText('Test', 1)).toBe('...');
      expect(truncateText('Test', 0)).toBe('...');
    });

    it('handles special characters correctly', () => {
      const text = 'Special chars: éñ中文';
      expect(truncateText(text, 10)).toBe('Special...');
      expect(truncateText('abc def', 6)).toBe('abc...');
    });
  });

  describe('debounce', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('delays function execution', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);
      
      debouncedFn('arg1', 'arg2');
      expect(fn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(50);
      expect(fn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(50);
      expect(fn).toHaveBeenCalledWith('arg1', 'arg2');
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('cancels previous calls when called multiple times', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);
      
      debouncedFn('call1');
      debouncedFn('call2');
      debouncedFn('call3');
      
      vi.advanceTimersByTime(100);
      
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('call3');
    });

    it('handles rapid successive calls correctly', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);
      
      for (let i = 0; i < 10; i++) {
        debouncedFn(`call${i}`);
        vi.advanceTimersByTime(50); // Less than delay
      }
      
      expect(fn).not.toHaveBeenCalled();
      
      vi.advanceTimersByTime(100);
      expect(fn).toHaveBeenCalledTimes(1);
      expect(fn).toHaveBeenCalledWith('call9');
    });

    it('preserves function context and arguments', () => {
      const fn = vi.fn();
      const debouncedFn = debounce(fn, 100);
      
      const complexArg = { key: 'value', nested: { data: [1, 2, 3] } };
      debouncedFn(complexArg, 42, 'string');
      
      vi.advanceTimersByTime(100);
      
      expect(fn).toHaveBeenCalledWith(complexArg, 42, 'string');
    });

    it('works with different delay values', () => {
      const fn = vi.fn();
      const debounced500 = debounce(fn, 500);
      const debounced1000 = debounce(fn, 1000);
      
      debounced500();
      debounced1000();
      
      vi.advanceTimersByTime(500);
      expect(fn).toHaveBeenCalledTimes(1);
      
      vi.advanceTimersByTime(500);
      expect(fn).toHaveBeenCalledTimes(2);
    });
  });

  describe('formatRating', () => {
    it('formats ratings to one decimal place', () => {
      expect(formatRating(8.567)).toBe('8.6');
      expect(formatRating(10)).toBe('10.0');
      expect(formatRating(0)).toBe('0.0');
      expect(formatRating(7.234)).toBe('7.2');
    });

    it('handles edge case ratings', () => {
      expect(formatRating(9.99)).toBe('10.0');
      expect(formatRating(0.01)).toBe('0.0');
      expect(formatRating(-1)).toBe('-1.0');
    });

    it('handles very precise decimal values', () => {
      expect(formatRating(8.56789123)).toBe('8.6');
      expect(formatRating(7.00000001)).toBe('7.0');
    });
  });

  describe('getYearFromDate', () => {
    it('extracts year from valid date strings', () => {
      expect(getYearFromDate('2024-01-15')).toBe('2024');
      expect(getYearFromDate('2023-12-31')).toBe('2023');
      expect(getYearFromDate('2000-06-15')).toBe('2000');
      expect(getYearFromDate('1999-01-01')).toBe('1999');
    });

    it('handles empty or falsy inputs', () => {
      expect(getYearFromDate('')).toBe('');
      expect(getYearFromDate(null as any)).toBe('');
      expect(getYearFromDate(undefined as any)).toBe('');
    });

    it('handles invalid date formats', () => {
      // These should still work due to Date constructor's flexibility
      expect(getYearFromDate('2023')).toBe('2023');
      expect(getYearFromDate('Dec 31, 2022')).toBe('2022');
    });

    it('handles edge cases with dates', () => {
      expect(getYearFromDate('2000-02-29')).toBe('2000'); // Leap year
      expect(getYearFromDate('1970-01-01')).toBe('1970'); // Unix epoch
    });

    it('handles completely invalid dates', () => {
      // Invalid dates should return 'NaN' from getFullYear
      const result = getYearFromDate('invalid-date-string');
      expect(result).toBe('NaN');
    });
  });

  describe('Integration and Edge Cases', () => {
    it('handles null and undefined inputs gracefully', () => {
      expect(() => formatCurrency(null as any)).not.toThrow();
      expect(() => formatRuntime(undefined as any)).not.toThrow();
      expect(() => truncateText(null as any, 10)).toThrow(); // Expected to throw
      expect(() => formatRating(undefined as any)).not.toThrow();
    });

    it('handles extreme numeric values', () => {
      expect(formatCurrency(Number.MAX_SAFE_INTEGER)).toBeDefined();
      expect(formatRuntime(Number.MAX_SAFE_INTEGER)).toBeDefined();
      expect(formatRating(Number.MAX_SAFE_INTEGER)).toBeDefined();
    });

    it('maintains consistent output format', () => {
      // Ensure functions are deterministic
      expect(formatRating(8.5)).toBe(formatRating(8.5));
      expect(formatRuntime(90)).toBe(formatRuntime(90));
      expect(formatCurrency(1000)).toBe(formatCurrency(1000));
    });
  });
});