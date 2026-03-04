// @ts-nocheck
import client from "../api/client";
import { io } from "socket.io-client/dist/socket.io";
import { useAuthStore } from "../stores/auth.store";

let socket;

export const connectSocket = (userId) => {
    if (!socket) {
        socket = io("https://zezt-backend-full.onrender.com", {
            transports: ["websocket"],
            query: { userId },
        });
    }

    return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};

export const createChatRoom = async (restaurantId) => {
    try {
        const user = useAuthStore.getState().user;
        const customerId = user?._id;
        if (!customerId) {
            throw new Error("User not logged in");
        }
        const res = await client.post("/chat/room", { customerId, restaurantId });
        return res.data;
    } catch (error) {
        console.error("Failed to create chat room", error);
        throw error;
    }
};

export const getAllChats = async () => {
    try {
        const user = useAuthStore.getState().user;
        const customerId = user?._id;
        if (!customerId) {
            throw new Error("User not logged in");
        }
        const res = await client.get(`/chat/customer/${customerId}`);
        return res.data;
    } catch (error) {
        console.error("Failed to get chats", error);
        throw error;
    }
};

export const getSingleChatHistory = async (chatId) => {
    try {
        const res = await client.get(`/chat/${chatId}`);
        return res.data;
    } catch (error) {
        console.error("Failed to get chat history", error);
        throw error;
    }
};
