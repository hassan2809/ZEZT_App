// @ts-nocheck

import axios from "axios";
import { useAuthStore } from "../stores/auth.store";

const client = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
});

client.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) {
          throw new Error("No refresh token available");
        }

        const { data } = await client.post("/user/refresh", {
          refreshToken: refreshToken
        });

        await useAuthStore.getState().setAuth({
          user: useAuthStore.getState().user,
          accessToken: data.accessToken,
          refreshToken: useAuthStore.getState().refreshToken, 
        });

        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return client(originalRequest);
      } catch (refreshErr) {
        await useAuthStore.getState().logout();
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default client;
