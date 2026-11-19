import { useQuery } from "@tanstack/react-query";
import { getMovie, OmdbError, searchMovies } from "../api/omdb";

export const movieKeys = {
  searches: ["movies", "search"] as const,
  search: (term: string) => ["movies", "search", term] as const,
  detail: (imdbId: string) => ["movies", "detail", imdbId] as const,
};

export function useMovieCollection(term: string) {
  return useQuery({
    queryKey: movieKeys.search(term),
    queryFn: ({ signal }) => searchMovies(term, signal),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
    retry: (failureCount, error: unknown) => {
      if (failureCount > 0) {
        return false;
      }
      if (error instanceof OmdbError && (error.kind === "network" || error.kind === "server")) {
        return true;
      }
      return false;
    },
    networkMode: "always",
  });
}

export function useMovieDetails(imdbId: string) {
  return useQuery({
    queryKey: movieKeys.detail(imdbId),
    queryFn: ({ signal }) => getMovie(imdbId, signal),
    staleTime: 1000 * 60 * 10,
    gcTime: 1000 * 60 * 15,
    retry: (failureCount, error: unknown) => {
      if (failureCount > 0) {
        return false;
      }
      if (error instanceof OmdbError && (error.kind === "network" || error.kind === "server")) {
        return true;
      }
      return false;
    },
    networkMode: "always",
  });
}
