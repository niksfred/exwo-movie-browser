import type { MovieSummary } from "../types";

export async function requestOmdb(params: Record<string, string>, signal?: AbortSignal): Promise<unknown> {
  const apiKey = process.env.EXPO_PUBLIC_OMDB_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing OMDb API key");
  }

  const searchParams = new URLSearchParams({
    apikey: apiKey,
    ...params
  });

  const response = await fetch(`https://www.omdbapi.com/?${searchParams}`, { signal });

  if (!response.ok) {
    throw new Error("OMDb request failed");
  }

  return response.json();
}

export async function searchMovies(query: string, signal?: AbortSignal): Promise<MovieSummary[]> {
  const raw: unknown = await requestOmdb({ s: query, type: "movie" }, signal);

  if (!isRecord(raw)) {
    throw new Error("Invalid OMDb response");
  }

  if (raw.Response === "False") {
    if (raw.Error === "Movie not found!") {
      return [];
    }

    throw new Error("OMDb search failed");
  }

  if (raw.Response !== "True" || !Array.isArray(raw.Search)) {
    throw new Error("Invalid OMDb search response");
  }

  return parseMovieSummaries(raw.Search);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(value: unknown): string | undefined {
  if (typeof value !== "string") {
    return undefined;
  }

  const text = value.trim();
  return text && text !== "N/A" ? text : undefined;
}

function parseMovieSummaries(rawMovies: unknown[]): MovieSummary[] {
  const parsedMovies: MovieSummary[] = [];

  for (const movie of rawMovies) {
    if (!isRecord(movie)) {
      continue;
    }

    const title = readText(movie.Title);
    const imdbId = readText(movie.imdbID);
    if (!title || !imdbId || !/^tt[0-9]+$/.test(imdbId)) {
      continue;
    }

    const parsedMovie: MovieSummary = { imdbId, title };
    const year = readText(movie.Year);
    const posterUrl = readText(movie.Poster);

    if (year !== undefined) {
      parsedMovie.year = year;
    }

    if (posterUrl !== undefined) {
      parsedMovie.posterUrl = posterUrl;
    }

    parsedMovies.push(parsedMovie);
  }

  if (rawMovies.length > 0 && parsedMovies.length === 0) {
    throw new Error("OMDb returned no usable movie entries");
  }

  return parsedMovies;
}
