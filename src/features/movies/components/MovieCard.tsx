import { Pressable, StyleSheet, Text } from "react-native";
import type { MovieSummary } from "../types";
import Poster from "./Poster";

type MovieCardProps = {
  movie: MovieSummary;
  onPress: () => void;
};

const cardWidth = 120;

export default function MovieCard({ movie, onPress }: MovieCardProps) {
  const label = movie.year ? `${movie.title}, ${movie.year}` : movie.title;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <Poster url={movie.posterUrl} width={cardWidth} />
      <Text numberOfLines={2} style={styles.title}>
        {movie.title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    gap: 6,
  },
  pressed: {
    opacity: 0.7,
  },
  title: {
    fontWeight: "600",
  },
});
