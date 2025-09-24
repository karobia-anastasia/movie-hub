// src/lib/tmdb.ts
import { Movie } from "@/types/movie";

const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

export const fetchMovies = async (query: string): Promise<Movie[]> => {
  const res = await fetch(`https://api.themoviedb.org/3/search/movie?query=${query}`, {
    headers: {
      Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_KEY}`,
      accept: "application/json",
    },
  });

  if (!res.ok) throw new Error("Failed to fetch movies");

  const data = await res.json();

  return data.results.map((m: any) => ({
    id: m.id,
    title: m.title,
    image: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : "/placeholder.jpg",
    rating: m.vote_average,
    year: m.release_date ? m.release_date.split("-")[0] : "N/A",
    genre: "N/A",     
    duration: "N/A",  
  }));
};
