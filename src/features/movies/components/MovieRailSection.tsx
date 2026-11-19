import { FlatList, StyleSheet, Text, View } from "react-native";
import { feedGutter, homeFeedStyles } from "../homeFeedStyles";
import MovieCard from "./MovieCard";
import MovieCollectionStatus from "./MovieCollectionStatus";
import { useMovieCollection } from "../queries/movieQueries";

type MovieRailSectionProps = {
  label: string;
  term: string;
  onSelectMovie: (imdbId: string) => void;
};

export default function MovieRailSection({ label, term, onSelectMovie }: MovieRailSectionProps) {
  const { isPending, isFetching, error, data, refetch } = useMovieCollection(term);

  return (
    <View>
      <Text style={homeFeedStyles.heading} accessibilityRole="header">{label}</Text>
      <FlatList
        horizontal
        data={data}
        contentContainerStyle={styles.rail}
        keyExtractor={(movie) => movie.imdbId}
        ListEmptyComponent={
          <MovieCollectionStatus
            isPending={isPending}
            isFetching={isFetching}
            error={error}
            refetch={refetch}
          />
        }
        renderItem={({ item }) => (
          <MovieCard movie={item} onPress={() => onSelectMovie(item.imdbId)} />
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    gap: 12,
    paddingHorizontal: feedGutter,
    paddingBottom: 8,
  },
});
