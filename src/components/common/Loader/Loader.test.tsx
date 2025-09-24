import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import Loader from './Loader';

describe('Loader', () => {
  it('renders film variant by default', () => {
    const { container } = render(<Loader />);
    const filmIcon = container.querySelector('svg');
    expect(filmIcon).toBeTruthy();
  });

  it('renders spinner variant', () => {
    const { container } = render(<Loader variant="spinner" />);
    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeTruthy();
  });

  it('renders dots variant with 3 dots', () => {
    const { container } = render(<Loader variant="dots" />);
    const dots = container.querySelectorAll('.h-3.w-3.rounded-full');
    expect(dots.length).toBe(3);
  });

  it('applies size classes correctly (lg)', () => {
    const { container } = render(<Loader size="lg" />);
    expect(container.querySelector('.scale-125')).toBeTruthy();
  });

  it('applies custom className', () => {
    const { container } = render(<Loader className="custom-loader" />);
    expect(container.querySelector('.custom-loader')).toBeTruthy();
  });

  it('renders fullScreen overlay when fullScreen is true', () => {
    const { container } = render(<Loader fullScreen />);
    const overlay = container.querySelector('.fixed.inset-0');
    expect(overlay).toBeTruthy();
  });
});
