import { View, Text } from "react-native";

type MovieDetailsScreenProps = {
  imdbId?: string;
}

export default function MovieDetailsScreen({ imdbId }: MovieDetailsScreenProps) {
  return <View>
    <Text>{imdbId}</Text>
  </View>
}
