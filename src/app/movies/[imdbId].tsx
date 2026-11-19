import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { isImdbId } from "../../features/movies/imdbId";
import MovieDetailsScreen from "../../features/movies/screens/MovieDetailsScreen";

export default function MovieDetailsRoute() {
  const { imdbId } = useLocalSearchParams<{ imdbId?: string | string[] }>();
  if (!isImdbId(imdbId)) {
    return <Text>Invalid IMDb ID</Text>;
  }

  return <MovieDetailsScreen imdbId={imdbId} />
}
