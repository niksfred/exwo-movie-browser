import { FlatList, Text, View } from "react-native";
import MovieCollectionStatus from "../components/MovieCollectionStatus";
import { collections, rowCollection } from "../collections";
import MovieRailSection from "../components/MovieRailSection";
import MovieRow from "../components/MovieRow";
import { homeFeedStyles } from "../homeFeedStyles";
import { useMovieCollection } from "../queries/movieQueries";

type HomeScreenProps = {
  onSelectMovie: (imdbId: string) => void;
};

const railCollections = collections.filter((collection) => collection.layout === "rail");

export default function HomeScreen({ onSelectMovie }: HomeScreenProps) {
  const { data, isPending, error, isFetching, refetch } = useMovieCollection(rowCollection.term);
  return (
    <FlatList
      data={data}
      keyExtractor={(movie) => movie.imdbId}
      ListHeaderComponent={
        <View>
          {railCollections.map(({ id, label, term }) => (
            <MovieRailSection
              key={id}
              label={label}
              term={term}
              onSelectMovie={onSelectMovie}
            />
          ))}
          <Text style={homeFeedStyles.heading} accessibilityRole="header">
            {rowCollection.label}
          </Text>
        </View>
      }
      ListEmptyComponent={
        <MovieCollectionStatus
          isPending={isPending}
          isFetching={isFetching}
          error={error}
          refetch={refetch}
        />
      }
      renderItem={({ item }) => (
        <MovieRow movie={item} onPress={() => onSelectMovie(item.imdbId)} />
      )}
    />
  );
}
