import { Text } from "react-native";
import MovieLoadError from "./MovieLoadError";

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

  return (
    <MovieLoadError
      error={error}
      message="Could not load movies."
      isFetching={isFetching}
      refetch={refetch}
    />
  );
}
