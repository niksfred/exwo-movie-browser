import { isImdbId } from "../imdbId";
import type { MovieSummary, MovieDetails } from "../types";

type OmdbErrorKind =
  | "config"
  | "auth"
  | "quota"
  | "network"
  | "server"
  | "not-found"
  | "invalid-response"
  | "api";

export class OmdbError extends Error {
  readonly kind: OmdbErrorKind;

  constructor(kind: OmdbErrorKind, message: string) {
    super(message);
    this.name = "OmdbError";
    this.kind = kind;
  }
}

export function isRetryableOmdbError(error: unknown): boolean {
  return error instanceof OmdbError && (error.kind === "network" || error.kind === "server");
}

export async function requestOmdb(
  params: Record<string, string>,
  signal?: AbortSignal,
): Promise<unknown> {
  const apiKey = process.env.EXPO_PUBLIC_OMDB_API_KEY?.trim();
  if (!apiKey) {
    throw new OmdbError("config", "Missing OMDb API key");
  }

  const searchParams = new URLSearchParams({
    apikey: apiKey,
    ...params,
  });

  let response: Response;
  try {
    response = await fetch(`https://www.omdbapi.com/?${searchParams}`, { signal });
  } catch (error) {
    if (signal?.aborted || (isRecord(error) && error.name === "AbortError")) {
      throw error;
    }
    throw new OmdbError("network", "Could not connect to OMDb");
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new OmdbError("auth", "Check your OMDb API key");
    }
    if (response.status === 429) {
      throw new OmdbError("quota", "OMDb request limit reached");
    }
    if (response.status >= 500 && response.status < 600) {
      throw new OmdbError("server", "OMDb is temporarily unavailable");
    }
    throw new OmdbError("api", "OMDb request failed");
  }

  try {
    return await response.json();
  } catch (error) {
    if (signal?.aborted || (isRecord(error) && error.name === "AbortError")) {
      throw error;
    }
    throw new OmdbError("invalid-response", "Could not decode the OMDb response");
  }
}

function decodeOmdbError(value: unknown): OmdbError {
  const message = readText(value)?.toLowerCase();

  switch (message) {
    case "invalid api key!":
    case "no api key provided.":
      return new OmdbError("auth", "Check your OMDb API key");
    case "request limit reached!":
    case "daily limit reached!":
      return new OmdbError("quota", "OMDb request limit reached");
    default:
      return new OmdbError("api", "OMDb request failed");
  }
}

export async function searchMovies(query: string, signal?: AbortSignal): Promise<MovieSummary[]> {
  const raw: unknown = await requestOmdb({ s: query, type: "movie" }, signal);

  if (!isRecord(raw)) {
    throw new OmdbError("invalid-response", "Invalid OMDb response");
  }

  if (raw.Response === "False") {
    if (raw.Error === "Movie not found!") {
      return [];
    }

    throw decodeOmdbError(raw.Error);
  }

  if (raw.Response !== "True" || !Array.isArray(raw.Search)) {
    throw new OmdbError("invalid-response", "Invalid OMDb search response");
  }

  return parseMovieSummaries(raw.Search);
}

export async function getMovie(imdbId: string, signal?: AbortSignal): Promise<MovieDetails> {
  const raw: unknown = await requestOmdb({ i: imdbId, type: "movie" }, signal);

  if (!isRecord(raw)) {
    throw new OmdbError("invalid-response", "Invalid OMDb response");
  }

  if (raw.Response === "False") {
    if (raw.Error === "Movie not found!") {
      throw new OmdbError("not-found", "Movie not found");
    }

    throw decodeOmdbError(raw.Error);
  }

  if (raw.Response !== "True") {
    throw new OmdbError("invalid-response", "Invalid OMDb movie response");
  }

  const parsedMovieDetails = parseMovieDetails(raw);

  if (parsedMovieDetails?.imdbId !== imdbId) {
    throw new OmdbError("invalid-response", "Invalid movie details response");
  }

  return parsedMovieDetails;
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
  const seenIds = new Set<string>();

  for (const movie of rawMovies) {
    const parsedMovie = parseMovieSummary(movie);
    if (!parsedMovie) {
      continue;
    }

    if (!seenIds.has(parsedMovie.imdbId)) {
      parsedMovies.push(parsedMovie);
      seenIds.add(parsedMovie.imdbId);
    }
  }

  if (rawMovies.length > 0 && parsedMovies.length === 0) {
    throw new OmdbError("invalid-response", "OMDb returned no usable movie entries");
  }

  return parsedMovies;
}

function parseMovieSummary(rawMovieSummary: unknown): MovieSummary | undefined {
  if (!isRecord(rawMovieSummary)) {
    return undefined;
  }

  const title = readText(rawMovieSummary.Title);
  const imdbId = readText(rawMovieSummary.imdbID);
  if (!title || !isImdbId(imdbId)) {
    return undefined;
  }

  const parsedMovie: MovieSummary = { imdbId, title };
  const year = readText(rawMovieSummary.Year);
  const posterUrl = readText(rawMovieSummary.Poster);

  if (year !== undefined) {
    parsedMovie.year = year;
  }

  if (posterUrl !== undefined) {
    parsedMovie.posterUrl = posterUrl;
  }

  return parsedMovie;
}

function parseMovieDetails(rawMovie: unknown): MovieDetails | undefined {
  if (!isRecord(rawMovie)) {
    return undefined;
  }
  const summary = parseMovieSummary(rawMovie);

  if (summary === undefined) {
    return undefined;
  }

  const details: MovieDetails = { ...summary };

  const runtime = readText(rawMovie.Runtime);
  const genre = readText(rawMovie.Genre);
  const plot = readText(rawMovie.Plot);
  const actors = readText(rawMovie.Actors);

  if (runtime !== undefined) {
    details.runtime = runtime;
  }
  if (genre) {
    details.genre = genre;
  }
  if (plot !== undefined) {
    details.plot = plot;
  }
  if (actors !== undefined) {
    details.cast = actors;
  }

  return details;
}
