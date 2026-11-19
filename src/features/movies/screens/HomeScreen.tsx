import { Button, Text, View } from 'react-native';

type HomeScreenProps = {
  onSelectMovie: (imdbId: string) => void;
};

export default function HomeScreen({ onSelectMovie }: HomeScreenProps) {
  return (
    <View>
      <Text>Home Screen</Text>
      <Button title="Open Batman Begins" onPress={() => onSelectMovie('tt0372784')} />
    </View>
  );
}
