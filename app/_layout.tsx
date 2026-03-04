// @ts-nocheck
import { useAuthStore } from "@/src/stores/auth.store";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Stack } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import "../global.css";
import { useLocationStore } from "@/src/stores/location.store";
import * as Location from "expo-location";
import { PaperProvider } from "react-native-paper";

export default function RootLayout() {
  const loadAuth = useAuthStore((state) => state.loadAuth);
  const loadLocation = useLocationStore((state) => state.loadLocation);
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  const clearLocation = useLocationStore((state) => state.clearLocation);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    (async () => {
      await loadAuth();
      await loadLocation();

      if (!location) {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let current = await Location.getCurrentPositionAsync({});
          await setLocation(current.coords);
        }
      }
    })();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <PaperProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="splash(index)" />
          </Stack>
        </PaperProvider>
        <Toast />
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}
