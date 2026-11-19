import { Button, Text, View } from "react-native";
import { OmdbError } from "../api/omdb";

type MovieCollectionStatusProps = {
  isPending: boolean;
  isFetching: boolean;
  error: unknown;
  refetch: () => unknown;
};

export default function MovieCollectionStatus({
  isPending,
  isFetching,
  error,
  refetch,
}: MovieCollectionStatusProps) {
  if (isPending) return <Text>Loading movies...</Text>;
  if (error == null) return <Text>No movies found.</Text>;

  const kind = error instanceof OmdbError ? error.kind : undefined;
  const canRetry = kind === "network" || kind === "server";
  const message =
    kind === "config" || kind === "auth"
      ? "Set a valid EXPO_PUBLIC_OMDB_API_KEY in .env.local and restart the app."
      : "Could not load movies.";

  return (
    <View>
      <Text>{message}</Text>
      {canRetry && (
        <Button title="Retry" disabled={isFetching} onPress={() => void refetch()} />
      )}
    </View>
  );
}
