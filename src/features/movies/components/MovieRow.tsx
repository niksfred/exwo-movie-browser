import { Pressable, StyleSheet, Text, View } from "react-native";
import { feedGutter } from "../homeFeedStyles";
import { useMovieDetails } from "../queries/movieQueries";
import type { MovieSummary } from "../types";
import Poster from "./Poster";

type MovieRowProps = {
  movie: MovieSummary;
  onPress: () => void;
};

export default function MovieRow({ movie, onPress }: MovieRowProps) {
  const { data: details } = useMovieDetails(movie.imdbId, { enabled: false });
  const genre = details?.genre;
  const label = [movie.title, movie.year, genre].filter(Boolean).join(", ");

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <Poster url={movie.posterUrl} width={56} />
      <View style={styles.copy}>
        <Text style={styles.title}>{movie.title}</Text>
        {movie.year && <Text>{movie.year}</Text>}
        {genre && <Text style={styles.genre}>{genre}</Text>}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: feedGutter,
    paddingVertical: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  copy: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
  },
  genre: {
    color: "#525766",
  },
});
