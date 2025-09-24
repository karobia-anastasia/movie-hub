// LoadingSkeleton.test.tsx
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import LoadingSkeleton from './LoadingSkeleton';

describe('LoadingSkeleton', () => {
  it('renders hero variant structure', () => {
    const { container } = render(<LoadingSkeleton variant="hero" />);
    // Should have full-screen hero wrapper
    expect(container.querySelector('.h-\\[80vh\\]')).toBeTruthy();
    // Should include at least one large title skeleton
    expect(container.querySelector('.h-12.w-3\\/4')).toBeTruthy();
  });

  it('renders row variant with 6 items', () => {
    const { container } = render(<LoadingSkeleton variant="row" />);
    const rowItems = container.querySelectorAll('.w-\\[200px\\]');
    expect(rowItems.length).toBe(6);
  });

  it('renders details variant structure', () => {
    const { container } = render(<LoadingSkeleton variant="details" />);
    // Poster skeleton
    expect(container.querySelector('.w-\\[300px\\]')).toBeTruthy();
    // Buttons (3 small skeletons)
    const buttons = container.querySelectorAll('.h-8.w-20');
    expect(buttons.length).toBe(3);
  });

  it('applies custom className', () => {
    const { container } = render(<LoadingSkeleton className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeTruthy();
  });
});
