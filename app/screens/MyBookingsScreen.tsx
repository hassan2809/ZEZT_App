// @ts-nocheck
import {
  getAllHistoryBookings,
  getAllUpcommingBookings,
} from "@/src/services/booking.service";
import { createChatRoom } from "@/src/services/chat.service";
import { useAuthStore } from "@/src/stores/auth.store";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Image, ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";

export default function MyBookingsScreen() {
  const [activeTab, setActiveTab] = useState("Upcoming");
  const user = useAuthStore((state) => state.user);
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [historyBookings, setHistoryBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchBookings = async () => {
        try {
          setLoading(true);
          if (activeTab === "Upcoming") {
            const data = await getAllUpcommingBookings();
            setUpcomingBookings(data);
          } else {
            const data = await getAllHistoryBookings();
            setHistoryBookings(data);
          }
        } catch (err) {
          console.log(err.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    }, [activeTab])
  );

  const handleStartChat = async (restaurantId) => {
    const res = await createChatRoom(restaurantId);
    const encodedUserName = encodeURIComponent(res.chat.restaurant.name);
    router.push(`/chat/${res.roomId}?userName=${encodedUserName}`);
  };

  const currentBookings =
    activeTab === "Upcoming" ? upcomingBookings : historyBookings;

  const handleBookingPress = (booking) => {
    if (activeTab === "Upcoming") {
      router.push({
        pathname: `/(tabs)/(detail)/booking-details/${booking._id}`,
        params: { session_id: booking._id }
      });
    }
  };

  const renderBookingCard = (booking) => (
    <TouchableOpacity
      key={booking._id}
      className="bg-white rounded-xl mb-4 mx-4 shadow-sm border border-gray-200"
      onPress={() => handleBookingPress(booking)}
      activeOpacity={0.7}
    >
      <View className="p-4">
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-row items-start flex-1">
            <Image
              source={{ uri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop" }}
              className="w-12 h-12 rounded-lg mr-3"
              resizeMode="cover"
            />
            <View>
              <Text className="text-black text-lg font-bold flex-1">
                {booking?.deal_id?.deal_title}
              </Text>
              <View>
                <View className="flex-row items-center">
                  <Feather name="calendar" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 text-sm ml-2">
                    {booking?.time_slot_id?.start_time}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Feather name="clock" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 text-sm ml-2">
                    {booking?.time_slot_id?.start_time}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Feather name="users" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 text-sm ml-2">
                    {booking?.party_size}
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <Feather name="map-pin" size={14} color="#9CA3AF" />
                  <Text className="text-gray-500 text-sm ml-2">
                    {booking?.deal_id?.restaurant_id?.address?.street}
                  </Text>
                </View>
              </View>
            </View>
          </View>
          <View
            className={`rounded-full px-3 py-1 ${activeTab === "Upcoming" ? "bg-green-100" : "bg-gray-100"
              }`}
          >
            <Text
              className={`text-xs font-medium ${activeTab === "Upcoming" ? "text-green-600" : "text-gray-500"
                }`}
            >
              {booking?.status}
            </Text>
          </View>
        </View>
        {activeTab === "History" && (
          <View>
            <View className="h-px bg-gray-200 my-4" />
            <Text className="text-gray-600 text-sm">Rate your experience:</Text>
            <View className="flex-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity key={star} className="mr-1">
                  <Text className="text-lg">
                    {booking?.rated && booking?.rating >= star ? "⭐" : "☆"}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
        {activeTab === "Upcoming" && (
          <View className="flex-row space-x-3 gap-2 mt-4">
            <TouchableOpacity className="flex-1 bg-[#E86969] rounded-xl py-3" onPress={() => router.push(`/(tabs)/(detail)/modify-booking/${booking._id}`)}>
              <Text className="text-white text-center font-bold text-base">
                Modify
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#E86969] rounded-xl py-3"
              onPress={() => handleStartChat(booking.deal_id.restaurant_id._id)}
            >
              <Text className="text-white text-center font-bold text-base">
                Chat
              </Text>
            </TouchableOpacity>
          </View>
        )}

      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="bg-white flex-1" edges={["top"]}>
      <ScreenHeader title="My Bookings" showAvatar/>
      <View className="flex-row mx-4 mb-6">
        <TouchableOpacity
          className={`flex-1 py-3 rounded-l-xl border ${activeTab === "Upcoming"
            ? "bg-[#E86969] border-[#E86969]"
            : "bg-gray-100 border-gray-200"
            }`}
          onPress={() => setActiveTab("Upcoming")}
        >
          <Text
            className={`text-center font-medium ${activeTab === "Upcoming" ? "text-white" : "text-gray-500"
              }`}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 rounded-r-xl border ${activeTab === "History"
            ? "bg-[#E86969] border-[#E86969]"
            : "bg-gray-100 border-gray-200"
            }`}
          onPress={() => setActiveTab("History")}
        >
          <Text
            className={`text-center font-medium ${activeTab === "History" ? "text-white" : "text-gray-500"
              }`}
          >
            History
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {loading ? (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500 text-lg">Loading...</Text>
          </View>
        ) : currentBookings.length > 0 ? (
          currentBookings.map(renderBookingCard)
        ) : (
          <View className="items-center justify-center py-20">
            <Text className="text-gray-500 text-lg">
              {activeTab === "Upcoming"
                ? "No upcoming bookings"
                : "No booking history"}
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
