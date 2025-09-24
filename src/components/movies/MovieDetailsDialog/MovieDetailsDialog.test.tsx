import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieDetailsDialog from "./MovieDetailsDialog";
import { tmdbEndpoints } from "@/api/tmdb";

// Mock TMDB API
jest.mock("@/api/tmdb", () => ({
  tmdbEndpoints: {
    movies: {
      details: jest.fn(),
      credits: jest.fn(),
    },
    utils: {
      getImageUrl: jest.fn((path: string, size: string) => `mock-url/${size}/${path}`),
    },
  },
}));

// Mock data
const mockMovie = {
  id: 1,
  title: "Test Movie",
  tagline: "A test tagline",
  backdrop_path: "backdrop.jpg",
  poster_path: "poster.jpg",
  overview: "This is a test overview.",
  vote_average: 7.5,
  vote_count: 1234,
  release_date: "2023-01-01",
  runtime: 120,
  genres: [{ id: 1, name: "Action" }],
  popularity: 88.5,
  budget: 1000000,
  revenue: 5000000,
  status: "Released",
  original_language: "en",
  production_companies: [{ id: 1, name: "Test Studio" }],
};

const mockCredits = {
  cast: [
    { id: 1, name: "Actor 1", character: "Hero", profile_path: "actor1.jpg" },
  ],
  crew: [
    { id: 2, name: "Director 1", job: "Director", profile_path: "director.jpg" },
  ],
};

describe("MovieDetailsDialog", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders nothing when closed", () => {
    render(<MovieDetailsDialog movieId={null} open={false} onOpenChange={jest.fn()} />);
    expect(screen.queryByText("Synopsis")).not.toBeInTheDocument();
  });

  it("fetches movie details when opened", async () => {
    (tmdbEndpoints.movies.details as jest.Mock).mockResolvedValue(mockMovie);
    (tmdbEndpoints.movies.credits as jest.Mock).mockResolvedValue(mockCredits);

    render(<MovieDetailsDialog movieId={1} open={true} onOpenChange={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("Test Movie")).toBeInTheDocument();
      expect(screen.getByText(/A test tagline/)).toBeInTheDocument();
    });

    expect(tmdbEndpoints.movies.details).toHaveBeenCalledWith(1);
    expect(tmdbEndpoints.movies.credits).toHaveBeenCalledWith(1);
  });

  it("renders loader while fetching", async () => {
    (tmdbEndpoints.movies.details as jest.Mock).mockImplementation(
      () => new Promise(() => {}) // never resolve
    );
    (tmdbEndpoints.movies.credits as jest.Mock).mockImplementation(
      () => new Promise(() => {})
    );

    render(<MovieDetailsDialog movieId={1} open={true} onOpenChange={jest.fn()} />);

    expect(screen.getByTestId("loader")).toBeInTheDocument();
  });

  it("renders cast and crew in Cast tab", async () => {
    (tmdbEndpoints.movies.details as jest.Mock).mockResolvedValue(mockMovie);
    (tmdbEndpoints.movies.credits as jest.Mock).mockResolvedValue(mockCredits);

    render(<MovieDetailsDialog movieId={1} open={true} onOpenChange={jest.fn()} />);

    await waitFor(() => screen.getByText("Test Movie"));

    fireEvent.click(screen.getByRole("tab", { name: /cast/i }));

    expect(screen.getByText("Actor 1")).toBeInTheDocument();
    expect(screen.getByText("Director 1")).toBeInTheDocument();
  });

  it("renders details in Details tab", async () => {
    (tmdbEndpoints.movies.details as jest.Mock).mockResolvedValue(mockMovie);
    (tmdbEndpoints.movies.credits as jest.Mock).mockResolvedValue(mockCredits);

    render(<MovieDetailsDialog movieId={1} open={true} onOpenChange={jest.fn()} />);

    await waitFor(() => screen.getByText("Test Movie"));

    fireEvent.click(screen.getByRole("tab", { name: /details/i }));

    expect(screen.getByText("Released")).toBeInTheDocument();
    expect(screen.getByText("EN")).toBeInTheDocument();
    expect(screen.getByText("Test Studio")).toBeInTheDocument();
  });
});
