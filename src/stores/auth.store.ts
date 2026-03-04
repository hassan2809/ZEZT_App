// @ts-nocheck
// import { AUTH_STORAGE_KEY } from "@env";
import * as SecureStore from "expo-secure-store";
import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  user: null,
  accessToken: null,
  refreshToken: null,

  setAuth: async ({ user, accessToken, refreshToken }) => {
    const state = { user, accessToken, refreshToken };
    set(state);
    await SecureStore.setItemAsync(process.env.EXPO_PUBLIC_AUTH_STORAGE_KEY, JSON.stringify(state));
  },

  loadAuth: async () => {
    try {
      const saved = await SecureStore.getItemAsync(process.env.EXPO_PUBLIC_AUTH_STORAGE_KEY);
      if (saved) {
        set(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Failed to load auth:", err);
    }
  },

  logout: async () => {
    set({ user: null, accessToken: null, refreshToken: null });
    await SecureStore.deleteItemAsync(process.env.EXPO_PUBLIC_AUTH_STORAGE_KEY);
  },
}));
