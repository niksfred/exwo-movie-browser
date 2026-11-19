import { View, Text, Image, Button } from "react-native";
import { movieKeys, useMovieDetails } from "../queries/movieQueries";
import queryClient from "../../../providers/queryClient";
import { MovieSummary } from "../types";
import { OmdbError } from "../api/omdb";

type MovieDetailsScreenProps = {
  imdbId: string;
};

export default function MovieDetailsScreen({ imdbId }: MovieDetailsScreenProps) {
  const cachedData = queryClient.getQueriesData<MovieSummary[]>({
    queryKey: movieKeys.searches,
  });
  const cachedMovie = cachedData
    .flatMap(([, movies]) => movies ?? [])
    .find((movie) => movie.imdbId === imdbId);

  const { isPending, isFetching, error, data, refetch } = useMovieDetails(imdbId);

  const movie = data ?? cachedMovie;
  const errorKind = error instanceof OmdbError ? error.kind : undefined;
  const canRetry = errorKind === "server" || "network";
  const needApiKey = errorKind === "config" || "auth";
  const errorMessage = needApiKey
    ? "Set a valid Omdb API Key and restart app"
    : "There's a problem loading movie details.";

  return (
    <View>
      {movie?.posterUrl && <Image source={{ uri: movie.posterUrl }} width={100} height={150} />}
      {movie && <Text>{movie.title}</Text>}
      {data?.plot && <Text>{data.plot}</Text>}
      {isPending && <Text>Loading movie...</Text>}
      {error != null && <Text>{errorMessage}</Text>}
      {canRetry && <Button title="Retry" disabled={isFetching} onPress={() => void refetch()} />}
    </View>
  );
}
