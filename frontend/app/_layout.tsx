import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";

import { useColorScheme } from "@/hooks/use-color-scheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={DarkTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen
            name="ApiConfigScreen"
            options={{ presentation: "modal", headerTitle: "Config" }}
          />
          <Stack.Screen
            name="PreviewScreen"
            options={{ presentation: "modal", headerTitle: "Preview" }}
          />
          <Stack.Screen
            name="LibraryScreen"
            options={{ presentation: "card", headerTitle: "Library" }}
          />
          <Stack.Screen
            name="MediaScreen"
            options={{ presentation: "card", headerTitle: "Media" }}
          />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
