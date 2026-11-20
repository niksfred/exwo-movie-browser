import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render } from "@testing-library/react-native";
import { movieKeys } from "../src/features/movies/queries/movieQueries";
import HomeScreen from "../src/features/movies/screens/HomeScreen";

jest.mock("expo/virtual/env", () => ({
  env: { EXPO_PUBLIC_OMDB_API_KEY: "test-key" },
}));

afterEach(() => {
  jest.restoreAllMocks();
});

test("selecting a Batman card passes its IMDb ID to the Home selection handler", async () => {
  jest.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const term = new URL(String(input)).searchParams.get("s");
    const payload = term === "Batman"
      ? {
          Response: "True",
          Search: [{ imdbID: "tt0372784", Title: "Batman Begins", Year: "2005" }],
        }
      : { Response: "False", Error: "Movie not found!" };

    return { ok: true, json: async () => payload } as Response;
  });

  const client = new QueryClient();
  const onSelectMovie = jest.fn();
  const screen = await render(
    <QueryClientProvider client={client}>
      <HomeScreen onSelectMovie={onSelectMovie} />
    </QueryClientProvider>,
  );

  try {
    const card = await screen.findByRole("button", { name: "Batman Begins, 2005" });
    await fireEvent.press(card);

    expect(onSelectMovie).toHaveBeenCalledTimes(1);
    expect(onSelectMovie).toHaveBeenCalledWith("tt0372784");
  } finally {
    await screen.unmount();
    client.clear();
  }
});

test("vertical rows render without fetching details and show genre from the cache", async () => {
  const imdbId = "tt0117060";
  const fetchMock = jest.spyOn(globalThis, "fetch").mockImplementation(async (input) => {
    const term = new URL(String(input)).searchParams.get("s");
    const payload = term === "Mission: Impossible"
      ? {
          Response: "True",
          Search: [{ imdbID: imdbId, Title: "Mission: Impossible" }],
        }
      : { Response: "False", Error: "Movie not found!" };

    return { ok: true, json: async () => payload } as Response;
  });

  const client = new QueryClient();
  const screen = await render(
    <QueryClientProvider client={client}>
      <HomeScreen onSelectMovie={jest.fn()} />
    </QueryClientProvider>,
  );

  try {
    await screen.findByRole("button", { name: "Mission: Impossible" });
    expect(fetchMock.mock.calls.map(([input]) => new URL(String(input)).searchParams.get("i")))
      .toEqual([null, null, null]);

    client.setQueryData(movieKeys.detail(imdbId), {
      imdbId,
      title: "Mission: Impossible",
      genre: "Action, Thriller",
    });
    await screen.findByText("Action, Thriller");
    expect(fetchMock).toHaveBeenCalledTimes(3);
  } finally {
    await screen.unmount();
    client.clear();
  }
});
