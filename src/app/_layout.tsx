import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import queryClient from '../providers/queryClient';

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Movies' }} />
        <Stack.Screen name="movies/[imdbId]" options={{ title: 'Movie Details' }} />
      </Stack>
    </QueryClientProvider>
  );
}

