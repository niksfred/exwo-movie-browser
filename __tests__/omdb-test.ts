import { getMovie, searchMovies } from "../src/features/movies/api/omdb";

jest.mock("expo/virtual/env", () => ({
  env: { EXPO_PUBLIC_OMDB_API_KEY: "test-key" },
}));

afterEach(() => {
  jest.restoreAllMocks();
});

function mockOmdbResponse(payload: unknown) {
  jest.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => payload,
  } as Response);
}

test("searchMovies keeps the first result per IMDb ID and omits unavailable posters", async () => {
  mockOmdbResponse({
    Response: "True",
    Search: [
      { imdbID: "tt0372784", Title: "Batman Begins", Year: "2005", Poster: "N/A" },
      { imdbID: "tt0372784", Title: "Duplicate result" },
      { imdbID: "tt0468569", Title: "The Dark Knight", Year: "2008" },
    ],
  });

  await expect(searchMovies("Batman")).resolves.toStrictEqual([
    { imdbId: "tt0372784", title: "Batman Begins", year: "2005" },
    { imdbId: "tt0468569", title: "The Dark Knight", year: "2008" },
  ]);
});

test("getMovie maps OMDb Actors to cast", async () => {
  mockOmdbResponse({
    Response: "True",
    imdbID: "tt0372784",
    Title: "Batman Begins",
    Actors: "Christian Bale, Michael Caine",
  });

  await expect(getMovie("tt0372784")).resolves.toStrictEqual({
    imdbId: "tt0372784",
    title: "Batman Begins",
    cast: "Christian Bale, Michael Caine",
  });
});

test.each([
  ["not-found", { Response: "False", Error: "Movie not found!" }],
  ["invalid-response", { Response: "True", imdbID: "tt0372784" }],
])("getMovie rejects with %s for the corresponding OMDb response", async (kind, payload) => {
  mockOmdbResponse(payload);

  await expect(getMovie("tt0372784")).rejects.toMatchObject({ kind });
});
