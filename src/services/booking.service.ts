// @ts-nocheck
import client from "../api/client";

export const createBooking = async (payload) => {
  try {
    const res = await client.post("/booking", payload);
    return res.data;
  } catch (error) {
    console.error("createBooking", error);
    throw error;
  }
};

export const updateBooking = async (bookingId, payload) => {
  try {
    const res = await client.put(`/booking/${bookingId}`, payload);
    return res.data;
  } catch (error) {
    if (error.response) {
      console.error("updateBooking failed:", error.response.data);
      throw new Error(error.response.data.error || "Failed to update booking");
    } else {
      console.error("updateBooking error:", error.message);
      throw error;
    }
  }
};

export const getAllUpcommingBookings = async () => {
  try {
    const res = await client.get(`/booking/user/upcoming`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch deals", error);
    throw error;
  }
};

export const getAllHistoryBookings = async () => {
  try {
    const res = await client.get(`/booking/user/history`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch deals", error);
    throw error;
  }
};

export const getBookingDetails = async (id) => {
  try {
    const res = await client.get(`/booking/${id}/details`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch deals", error);
    throw error;
  }
};
