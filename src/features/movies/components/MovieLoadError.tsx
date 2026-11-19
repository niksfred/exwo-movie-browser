import { Button, Text, View } from "react-native";
import type { StyleProp, TextStyle } from "react-native";
import { isRetryableOmdbError, OmdbError } from "../api/omdb";

type MovieLoadErrorProps = {
  error: unknown;
  message: string;
  isFetching: boolean;
  refetch: () => unknown;
  textStyle?: StyleProp<TextStyle>;
};

export default function MovieLoadError({
  error,
  message,
  isFetching,
  refetch,
  textStyle,
}: MovieLoadErrorProps) {
  const kind = error instanceof OmdbError ? error.kind : undefined;
  const needsApiKey = kind === "config" || kind === "auth";

  return (
    <View>
      <Text style={textStyle}>
        {needsApiKey
          ? "Set a valid EXPO_PUBLIC_OMDB_API_KEY in .env.local and restart the app."
          : message}
      </Text>
      {isRetryableOmdbError(error) && (
        <Button title="Retry" disabled={isFetching} onPress={() => void refetch()} />
      )}
    </View>
  );
}
