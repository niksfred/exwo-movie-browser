import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react-native";
import MovieDetailsScreen from "../src/features/movies/screens/MovieDetailsScreen";

jest.mock("expo/virtual/env", () => ({
  env: { EXPO_PUBLIC_OMDB_API_KEY: "test-key" },
}));

afterEach(() => {
  jest.restoreAllMocks();
});

test("Details loads a movie from its IMDb ID with an empty query cache", async () => {
  const imdbId = "tt0372784";
  const plot = "Bruce Wayne returns to Gotham to fight crime.";
  const fetchMock = jest.spyOn(globalThis, "fetch").mockResolvedValue({
    ok: true,
    json: async () => ({
      Response: "True",
      imdbID: imdbId,
      Title: "Batman Begins",
      Plot: plot,
      Actors: "Christian Bale",
    }),
  } as Response);

  const client = new QueryClient();
  const screen = await render(
    <QueryClientProvider client={client}>
      <MovieDetailsScreen imdbId={imdbId} />
    </QueryClientProvider>,
  );

  try {
    await screen.findByRole("header", { name: "Batman Begins" });
    expect(screen.getByText(plot)).toBeOnTheScreen();
    expect(screen.getByText("Christian Bale")).toBeOnTheScreen();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const requestUrl = new URL(String(fetchMock.mock.calls[0][0]));
    expect(requestUrl.searchParams.get("i")).toBe(imdbId);
  } finally {
    await screen.unmount();
    client.clear();
  }
});
