import { Text } from "react-native";
import { useLocalSearchParams } from "expo-router"
import MovieDetailsScreen from "../../features/movies/screens/MovieDetailsScreen";

export default function MovieDetailsRoute() {
  const { imdbId } = useLocalSearchParams<{ imdbId?: string | string[] }>();
  const imdbRegex = /^tt[0-9]+$/;

  if (typeof imdbId !== 'string' || !imdbRegex.test(imdbId)) {
    return <Text>Invalid IMDb ID</Text>;
  }

  return <MovieDetailsScreen imdbId={imdbId} />
}
