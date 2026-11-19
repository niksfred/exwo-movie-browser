import { View } from "react-native";
import { batmanCollection } from "../collections";
import MovieRailSection from "../components/MovieRailSection";

type HomeScreenProps = {
  onSelectMovie: (imdbId: string) => void;
};

export default function HomeScreen({ onSelectMovie }: HomeScreenProps) {
  return (
    <View>
      <MovieRailSection
        label={batmanCollection.label}
        term={batmanCollection.term}
        onSelectMovie={onSelectMovie}
      />
    </View>
  );
}
