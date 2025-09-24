import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MovieTrailer from "./MovieTrailer";

// Mock fetch
global.fetch = jest.fn();

const mockVideos = {
  results: [
    {
      id: "1",
      key: "abcd1234",
      name: "Official Trailer",
      site: "YouTube",
      type: "Trailer",
    },
    {
      id: "2",
      key: "efgh5678",
      name: "Teaser Clip",
      site: "YouTube",
      type: "Teaser",
    },
  ],
};

describe("MovieTrailer", () => {
  beforeEach(() => {
    (fetch as jest.Mock).mockClear();
  });

  it("renders 'No trailer available' when no videos found", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => ({ results: [] }),
    });

    render(<MovieTrailer movieId={1} open={true} onOpenChange={jest.fn()} />);

    await waitFor(() => {
      expect(screen.getByText("No trailer available")).toBeInTheDocument();
    });
  });

  it("renders trailer iframe when videos are available", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockVideos,
    });

    render(<MovieTrailer movieId={1} open={true} onOpenChange={jest.fn()} />);

    const iframe = await screen.findByTitle("Official Trailer");
    expect(iframe).toBeInTheDocument();
    expect(iframe).toHaveAttribute(
      "src",
      expect.stringContaining("abcd1234")
    );
  });

  it("allows switching between videos via buttons", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockVideos,
    });

    render(<MovieTrailer movieId={1} open={true} onOpenChange={jest.fn()} />);

    // Wait for trailer
    await screen.findByTitle("Official Trailer");

    const teaserBtn = screen.getByText("Teaser Clip");
    fireEvent.click(teaserBtn);

    await waitFor(() => {
      expect(screen.getByTitle("Teaser Clip")).toBeInTheDocument();
    });
  });

  it("calls onOpenChange(false) when close button is clicked", async () => {
    (fetch as jest.Mock).mockResolvedValueOnce({
      json: async () => mockVideos,
    });

    const handleOpenChange = jest.fn();
    render(
      <MovieTrailer movieId={1} open={true} onOpenChange={handleOpenChange} />
    );

    await screen.findByTitle("Official Trailer");

    const closeBtn = screen.getByRole("button");
    fireEvent.click(closeBtn);

    expect(handleOpenChange).toHaveBeenCalledWith(false);
  });
});
