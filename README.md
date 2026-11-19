# ExWo Movie Browser

A React Native movie browser built with Expo, TypeScript, and the OMDb API. Home has horizontal Batman and Star Trek poster rails and a vertical Mission: Impossible list. Tap any movie to open its poster, metadata, plot, and cast when available.

## Run locally

Tested with Node.js 24.21.0 and npm 11.19.0. The project uses Expo SDK 58.

1. Run `npm ci`.
2. Request and activate a [free OMDb API key](https://www.omdbapi.com/apikey.aspx).
3. Copy `.env.example` to `.env.local` and set the variable below. Supply your own key and keep `.env.local` out of version control.

   ```dotenv
   EXPO_PUBLIC_OMDB_API_KEY=your_key_here
   ```

4. Run `npm start` and open the project in an SDK 58-compatible Expo Go client or an installed development build. To build locally, run `npm run android` with the Android SDK and an emulator or connected device, or `npm run ios` on macOS with Xcode and an iOS simulator.

## Checks

```sh
npx expo customize tsconfig.json
npm run typecheck
npm run lint
npm test -- --runInBand
```

Expo Router generates route types when the development server starts. The first command prepares them when running the checks before starting Expo. The Jest tests use mocked OMDb responses and run without a device or API key.

For a device smoke check, swipe both rails, scroll down to Mission: Impossible, and open a movie from each layout. Check that Back returns to the feed and that the poster fallback appears when artwork is unavailable.

## Project structure

- `src/app` contains the Expo Router routes. Details receives the IMDb ID in the route.
- `src/features/movies` contains the screens, reusable movie components, collection settings, query hooks, and OMDb adapter.
- `src/providers` holds the shared TanStack Query client. Search results can provide a cached poster and title while Details loads. Vertical rows reuse the detail cache to show genre when available.
