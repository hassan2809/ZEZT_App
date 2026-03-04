// @ts-nocheck
import React from "react";
import { Portal, Dialog, Paragraph, Button } from "react-native-paper";
import * as Location from "expo-location";
import { useLocationStore } from "@/src/stores/location.store";

export default function LocationDialog({ visible, onDismiss }) {
  const setLocation = useLocationStore((state) => state.setLocation);

  const handleAllow = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        let current = await Location.getCurrentPositionAsync({});
        await setLocation(current.coords);
      }
    } catch (err) {
      console.error("Location error:", err);
    }
    onDismiss(); 
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>We need your location!!!</Dialog.Title>
        <Dialog.Content>
          <Paragraph>
            To provide better recommendations and nearby deals, we need access
            to your location.
          </Paragraph>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancel</Button>
          <Button onPress={handleAllow}>Allow</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}
