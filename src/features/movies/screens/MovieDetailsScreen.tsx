import { ScrollView, StyleSheet, Text, View } from "react-native";
import queryClient from "../../../providers/queryClient";
import MovieLoadError from "../components/MovieLoadError";
import Poster from "../components/Poster";
import { feedGutter } from "../homeFeedStyles";
import { movieKeys, useMovieDetails } from "../queries/movieQueries";
import type { MovieSummary } from "../types";

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
  const metadata = [movie?.year, data?.runtime, data?.genre].filter(Boolean).join(" · ");

  return (
    <ScrollView contentContainerStyle={styles.content}>
      {movie && (
        <View style={styles.summary}>
          <Poster url={movie.posterUrl} width={148} />
          <Text accessibilityRole="header" style={styles.title}>{movie.title}</Text>
          {metadata !== "" && <Text style={styles.metadata}>{metadata}</Text>}
        </View>
      )}
      {data?.plot && (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.heading}>Plot</Text>
          <Text style={styles.body}>{data.plot}</Text>
        </View>
      )}
      {data?.cast && (
        <View style={styles.section}>
          <Text accessibilityRole="header" style={styles.heading}>Cast</Text>
          <Text style={styles.body}>{data.cast}</Text>
        </View>
      )}
      {isPending && <Text style={styles.body}>Loading movie...</Text>}
      {error != null && (
        <MovieLoadError
          error={error}
          message="There's a problem loading movie details."
          isFetching={isFetching}
          refetch={refetch}
          textStyle={styles.body}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: feedGutter,
    paddingTop: 20,
    paddingBottom: 32,
    gap: 24,
  },
  summary: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    marginTop: 4,
  },
  metadata: {
    color: "#525766",
    fontSize: 15,
    lineHeight: 22,
  },
  section: {
    gap: 6,
  },
  heading: {
    fontSize: 18,
    fontWeight: "700",
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
});
