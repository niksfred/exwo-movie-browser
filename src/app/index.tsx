import { useRouter } from 'expo-router';

import HomeScreen from '../features/movies/screens/HomeScreen';

export default function HomeRoute() {
  const router = useRouter();

  return (
    <HomeScreen
      onSelectMovie={(imdbId) =>
        router.push({ pathname: '/movies/[imdbId]', params: { imdbId } })
      }
    />
  );
}

