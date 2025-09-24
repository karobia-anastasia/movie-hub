import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import MovieRow from "./MovieRow";
import { Movie } from "@/types/movie";

// Mock child components
jest.mock("../MovieCard/MovieCard", () => {
  const MovieCard = ({ movie, onClick }: any) => (
    <div data-testid={`movie-card-${movie.id}`} onClick={onClick}>
      {movie.title}
    </div>
  );
  return {
    __esModule: true,
    default: MovieCard,
    MovieCardSkeleton: () => <div data-testid="skeleton-card">Skeleton</div>,
  };
});

const mockMovies: Movie[] = [
  { id: 1, title: "Movie One", poster_path: "/m1.jpg", backdrop_path: "/b1.jpg", overview: "Test 1", release_date: "2023-01-01", vote_average: 7.2, vote_count: 100, popularity: 50 },
  { id: 2, title: "Movie Two", poster_path: "/m2.jpg", backdrop_path: "/b2.jpg", overview: "Test 2", release_date: "2023-02-01", vote_average: 8.1, vote_count: 200, popularity: 70 },
];

describe("MovieRow", () => {
  it("renders title", () => {
    render(<MovieRow title="Trending Movies" movies={mockMovies} />);
    expect(screen.getByText("Trending Movies")).toBeInTheDocument();
  });

  it("renders movie cards when not loading", () => {
    render(<MovieRow title="Now Playing" movies={mockMovies} />);
    expect(screen.getByText("Movie One")).toBeInTheDocument();
    expect(screen.getByText("Movie Two")).toBeInTheDocument();
  });

  it("renders skeletons when loading", () => {
    render(<MovieRow title="Loading Row" movies={[]} loading />);
    const skeletons = screen.getAllByTestId("skeleton-card");
    expect(skeletons).toHaveLength(6);
  });

  it("calls onMovieClick when a movie is clicked", () => {
    const handleClick = jest.fn();
    render(<MovieRow title="Clickable" movies={mockMovies} onMovieClick={handleClick} />);
    fireEvent.click(screen.getByTestId("movie-card-1"));
    expect(handleClick).toHaveBeenCalledWith(mockMovies[0]);
  });

  it("scrolls when scroll buttons are clicked", () => {
    render(<MovieRow title="Scroll Test" movies={mockMovies} />);
    const scrollContainer = screen.getByText("Movie One").parentElement?.parentElement as HTMLDivElement;

    // mock scrollTo
    scrollContainer.scrollTo = jest.fn();

    const [leftButton, rightButton] = screen.getAllByRole("button");

    fireEvent.click(rightButton);
    expect(scrollContainer.scrollTo).toHaveBeenCalledWith({ left: 300, behavior: "smooth" });

    fireEvent.click(leftButton);
    expect(scrollContainer.scrollTo).toHaveBeenCalledWith({ left: -300, behavior: "smooth" });
  });
});
