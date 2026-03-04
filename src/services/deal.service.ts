// @ts-nocheck
import client from "../api/client";

export const getAllDeals = async () => {
  try {
    const res = await client.get("/deal/status/active");
    return res.data.deals;
  } catch (error) {
    console.error("Failed to fetch deals", error);
    throw error;
  }
};

export const getSingleDeal = async (id) => {
  try {
    const res = await client.get(`/deal/${id}`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch deal details", error);
    throw error;
  }
};

export const getTimeSlotsOfDeal = async (id) => {
  try {
    const res = await client.get(`/deal/deals/${id}/timeslots`);
    return res.data;
  } catch (error) {
    console.error("Failed to fetch deal details", error);
    throw error;
  }
};

export const getDealsWithFilters = async (filters) => {
  try {
    const queryString = Object.entries(filters)
      .filter(([_, value]) => value !== null && value !== undefined) 
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join("&");
    const url = `/deal/search?${queryString}`;
    const res = await client.get(url);
    return res.data.deals;
  } catch (error) {
    console.error("Failed to fetch deals", error);
    throw error;
  }
};