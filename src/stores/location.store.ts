// @ts-nocheck

import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export const useLocationStore = create((set) => ({
  location: null,

  setLocation: async (coords) => {
    const state = { location: coords };
    set(state);
    await SecureStore.setItemAsync(
      process.env.EXPO_PUBLIC_LOCATION_STORAGE_KEY,
      JSON.stringify(coords)
    );
  },

  loadLocation: async () => {
    try {
      const saved = await SecureStore.getItemAsync(
        process.env.EXPO_PUBLIC_LOCATION_STORAGE_KEY
      );
      if (saved) {
        set({ location: JSON.parse(saved) });
      }
    } catch (err) {
      console.error("Failed to load location:", err);
    }
  },

  clearLocation: async () => {
    set({ location: null });
    await SecureStore.deleteItemAsync(
      process.env.EXPO_PUBLIC_LOCATION_STORAGE_KEY
    );
  },
}));
