// @ts-nocheck
import client from "../api/client";

export const login = async (credentials) => {
  try {
    const res = await client.post("/authenticate", credentials);
    return res.data;
  } catch (error) {
    console.error("Login error:", error);
    throw error.response?.data || error;
  }
};

export const register = async (payload) => {
  try {
    const { confirmPassword, termsAccepted, ...rest } = payload;
    const res = await client.post("/user/customer", rest);
    return res.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error.response?.data || error;
  }
};

export const forgotPassword = async (email) => {
  try {
    const res = await client.post("/authenticate/forgot-password", { email });
    return res.data;
  } catch (error) {
    console.error("Forgot Password error:", error);
    throw error.response?.data || error;
  }
};

export const verifyCode = async (email, code) => {
  try {
    const res = await client.post("/authenticate/verify-code", { email, code });
    return res.data;
  } catch (error) {
    console.error("Forgot Password error:", error);
    throw error.response?.data || error;
  }
};

export const resetPassword = async (email, newPassword) => {
  try {
    const res = await client.post("/authenticate/reset-password", { email, newPassword });
    return res.data;
  } catch (error) {
    console.error("Forgot Password error:", error);
    throw error.response?.data || error;
  }
};
