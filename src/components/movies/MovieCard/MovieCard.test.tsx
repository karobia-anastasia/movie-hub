import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import MovieCard, { MovieCardSkeleton } from "./MovieCard";
import { Movie } from "@/types/movie";

// --- Mock utils ---
vi.mock("@/api/tmdb", () => ({
  tmdbEndpoints: {
    utils: {
      getImageUrl: (path: string, size: string) => `https://image.tmdb.org/t/p/${size}${path}`,
    },
  },
}));

vi.mock("@/utils/helpers", () => ({
  formatRating: (rating: number) => rating.toFixed(1),
  getYearFromDate: (date: string) => new Date(date).getFullYear(),
  truncateText: (text: string, len: number) =>
    text.length > len ? text.slice(0, len) + "..." : text,
}));

vi.mock("@/utils/constants", () => ({
  getRatingColor: (rating: number) => (rating > 7 ? "green" : "red"),
}));

// --- Mock Context ---
const mockAddToFavorites = vi.fn();
const mockRemoveFromFavorites = vi.fn();
const mockAddToWatchlist = vi.fn();
const mockRemoveFromWatchlist = vi.fn();

vi.mock("@/contexts/MovieContext", () => ({
  useMovieContext: () => ({
    isFavorite: (id: number) => id === 1,
    addToFavorites: mockAddToFavorites,
    removeFromFavorites: mockRemoveFromFavorites,
    isInWatchlist: (id: number) => id === 1,
    addToWatchlist: mockAddToWatchlist,
    removeFromWatchlist: mockRemoveFromWatchlist,
  }),
}));

// --- Mock Movie ---
const mockMovie: Movie = {
  id: 1,
  title: "Inception",
  overview: "A mind-bending thriller.",
  backdrop_path: "/inception-bg.jpg",
  poster_path: "/inception.jpg",
  vote_average: 8.8,
  vote_count: 12000,
  release_date: "2010-07-16",
};

describe("MovieCard", () => {
  it("renders default variant with movie details", () => {
    render(<MovieCard movie={mockMovie} variant="default" />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
    expect(screen.getByText("8.8")).toBeInTheDocument();
    expect(screen.getByText(/A mind-bending thriller/)).toBeInTheDocument();

    const img = screen.getByRole("img", { name: "Inception" }) as HTMLImageElement;
    expect(img.src).toContain("https://image.tmdb.org/t/p/w500/inception.jpg");
  });

  it("renders compact variant with movie details", () => {
    render(<MovieCard movie={mockMovie} variant="compact" />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
    expect(screen.getByText("8.8")).toBeInTheDocument();
  });

  it("calls onClick when card is clicked", () => {
    const handleClick = vi.fn();
    render(<MovieCard movie={mockMovie} onClick={handleClick} />);

    fireEvent.click(screen.getByText("Inception"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("handles favorite toggle", () => {
    render(<MovieCard movie={mockMovie} />);
    const favButton = screen.getAllByRole("button").find((btn) =>
      btn.querySelector("svg")
    ) as HTMLButtonElement;

    fireEvent.click(favButton);
    // Since id=1 isFavorite, it should remove
    expect(mockRemoveFromFavorites).toHaveBeenCalledWith(1);
  });

  it("handles watchlist toggle", () => {
    render(<MovieCard movie={mockMovie} />);
    const buttons = screen.getAllByRole("button");
    const watchlistButton = buttons[1]; // second button is +/watchlist

    fireEvent.click(watchlistButton);
    // Since id=1 isInWatchlist, it should remove
    expect(mockRemoveFromWatchlist).toHaveBeenCalledWith(1);
  });
});

describe("MovieCardSkeleton", () => {
  it("renders skeleton placeholders", () => {
    render(<MovieCardSkeleton />);
    expect(screen.getAllByRole("status").length).toBeGreaterThan(0);
  });
});
