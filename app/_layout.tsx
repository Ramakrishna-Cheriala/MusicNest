import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import PermissionChecker from "./PermissionChecker";

import { useColorScheme } from "@/hooks/useColorScheme";
import TrackPlayer from "react-native-track-player";
import { initializePlayer } from "@/TrackPlayerServices";
import { playbackService } from "@/constants/playbackService";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();
// TrackPlayer.registerPlaybackService(() => require("@/service"));

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const setupTrackPlayer = async () => {
      console.log("start...");
      await initializePlayer();
      TrackPlayer.registerPlaybackService(() => require("@/service"));
    };

    setupTrackPlayer();
  }, []);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <PermissionChecker>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </PermissionChecker>
    </ThemeProvider>
  );
}
