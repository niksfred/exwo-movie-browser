import { useQuery } from "@tanstack/react-query";
import { getMovie, isRetryableOmdbError, searchMovies } from "../api/omdb";

export const movieKeys = {
  searches: ["movies", "search"] as const,
  search: (term: string) => ["movies", "search", term] as const,
  detail: (imdbId: string) => ["movies", "detail", imdbId] as const,
};

const movieQueryPolicy = {
  staleTime: 1000 * 60 * 10,
  gcTime: 1000 * 60 * 15,
  retry: (failureCount: number, error: unknown) =>
    failureCount === 0 && isRetryableOmdbError(error),
  networkMode: "always",
} as const;

export function useMovieCollection(term: string) {
  return useQuery({
    queryKey: movieKeys.search(term),
    queryFn: ({ signal }) => searchMovies(term, signal),
    ...movieQueryPolicy,
  });
}

export function useMovieDetails(imdbId: string, { enabled = true } = {}) {
  return useQuery({
    queryKey: movieKeys.detail(imdbId),
    queryFn: ({ signal }) => getMovie(imdbId, signal),
    ...movieQueryPolicy,
    enabled,
  });
}
