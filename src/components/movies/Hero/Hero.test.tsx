import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import Hero from "./Hero";
import { Movie } from "@/types/movie";

// Mock utils
vi.mock("@/api/tmdb", () => ({
  tmdbEndpoints: {
    utils: {
      getImageUrl: (path: string, size: string) =>
        `https://image.tmdb.org/t/p/${size}${path}`,
    },
  },
}));

vi.mock("@/utils/helpers", () => ({
  formatRating: (rating: number) => rating.toFixed(1),
  truncateText: (text: string, len: number) =>
    text.length > len ? text.slice(0, len) + "..." : text,
}));

const mockMovie: Movie = {
  id: 1,
  title: "Inception",
  overview: "A mind-bending thriller about dreams within dreams.",
  backdrop_path: "/inception.jpg",
  vote_average: 8.8,
  vote_count: 12000,
  release_date: "2010-07-16",
  poster_path: "/poster.jpg",
};

describe("Hero", () => {
  it("renders skeleton when no movie is provided", () => {
    render(<Hero movie={null} />);
    expect(screen.getByRole("img", { hidden: true })).not.toBeInTheDocument();
  });

  it("renders movie details when movie is provided", () => {
    render(<Hero movie={mockMovie} />);

    expect(screen.getByText("Inception")).toBeInTheDocument();
    expect(screen.getByText("8.8")).toBeInTheDocument();
    expect(screen.getByText("2010")).toBeInTheDocument();
    expect(screen.getByText("12,000 votes")).toBeInTheDocument();
    expect(
      screen.getByText(/A mind-bending thriller about dreams/)
    ).toBeInTheDocument();
  });

  it("calls onPlayClick when Play button is clicked", () => {
    const handlePlay = vi.fn();
    render(<Hero movie={mockMovie} onPlayClick={handlePlay} />);

    fireEvent.click(screen.getByText(/Play Trailer/i));
    expect(handlePlay).toHaveBeenCalledTimes(1);
  });

  it("calls onInfoClick when More Info button is clicked", () => {
    const handleInfo = vi.fn();
    render(<Hero movie={mockMovie} onInfoClick={handleInfo} />);

    fireEvent.click(screen.getByText(/More Info/i));
    expect(handleInfo).toHaveBeenCalledTimes(1);
  });

  it("renders backdrop image with correct src", () => {
    render(<Hero movie={mockMovie} />);
    const img = screen.getByRole("img", { name: "Inception" }) as HTMLImageElement;
    expect(img.src).toBe("https://image.tmdb.org/t/p/original/inception.jpg");
  });
});
