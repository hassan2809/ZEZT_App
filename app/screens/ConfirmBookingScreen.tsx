// @ts-nocheck
import { createBooking } from "@/src/services/booking.service";
import { getSingleDeal, getTimeSlotsOfDeal } from "@/src/services/deal.service";
import { useAuthStore } from "@/src/stores/auth.store";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as WebBrowser from 'expo-web-browser';

export default function ConfirmBookingScreen() {
  const { dealId } = useLocalSearchParams();
  const router = useRouter();
  const [selectedPartySize, setSelectedPartySize] = useState(2);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
  const [deal, setDeal] = useState(null);
  const [slots, setSlots] = useState([]);
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchSingleDeal = async () => {
      try {
        setLoading(true);
        const data = await getSingleDeal(dealId);
        setDeal(data);
      } catch (err) {
        console.log(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    const fetchTimeSlots = async () => {
      try {
        setLoading(true);
        const data = await getTimeSlotsOfDeal(dealId);
        setSlots(data?.timeslots || []);
      } catch (err) {
        console.log(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleDeal();
    fetchTimeSlots();
  }, []);

  const partySizes = Array.from(
    { length: selectedTimeSlot?.available_seats || 0 },
    (_, i) => i + 1
  );

  const groupedSlots = useMemo(() => {
    const map = {};
    slots.forEach((slot) => {
      const date = dayjs(slot.start_time).format("YYYY-MM-DD");
      if (!map[date]) map[date] = [];
      map[date].push(slot);
    });
    return map;
  }, [slots]);

  const availableDates = Object.keys(groupedSlots);

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTimeSlot) {
      Toast.show({
        type: "error",
        text1: "Missing Selection",
        text2: "Please select both date and time slot",
      });
      return;
    }

    try {
      setIsSubmitting(true)
      const payload = {
        dealId,
        timeSlotID: selectedTimeSlot.timeslot_id,
        party_size: selectedPartySize,
        cost:
          Number(deal?.price?.replace(/[^0-9.-]+/g, "") || 0) *
          selectedPartySize,
      };
      const res = await createBooking(payload);
      await WebBrowser.openBrowserAsync(res.url);

      // router.push(`/booking-details/${res.booking._id}`);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: error.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false)
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white flex-1 items-center justify-center">
        <Text className="text-gray-500 text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1" edges={["top"]}>
      <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
        <Text className="text-center text-black text-2xl font-bold mt-8">
          Confirm Booking
        </Text>
        <Text className="text-gray-400 text-center text-lg mb-8">
          {deal?.name}
        </Text>

        {/* Party Size */}
        <View className="mb-8">
          <Text className="text-black text-xl font-bold mb-4">Party Size</Text>
          <View className="flex-row flex-wrap gap-3">
            {partySizes.map((size) => (
              <TouchableOpacity
                key={size}
                className={`w-12 h-12 rounded-lg items-center justify-center border ${selectedPartySize === size
                  ? "bg-[#E86969] border-[#E86969]"
                  : "bg-white border-gray-200"
                  }`}
                onPress={() => setSelectedPartySize(size)}
              >
                <Text
                  className={`text-lg font-medium ${selectedPartySize === size ? "text-white" : "text-gray-600"
                    }`}
                >
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Date Selection */}
        <View className="mb-8">
          <Text className="text-black text-xl font-bold mb-4">Select Date</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {availableDates.map((date) => (
              <TouchableOpacity
                key={date}
                className={`px-4 py-2 rounded-lg mr-3 ${selectedDate === date
                  ? "bg-[#E86969]"
                  : "bg-white border border-gray-300"
                  }`}
                onPress={() => {
                  setSelectedDate(date);
                  setSelectedTimeSlot(null);
                }}
              >
                <Text
                  className={`text-base ${selectedDate === date ? "text-white" : "text-gray-600"
                    }`}
                >
                  {dayjs(date).format("MMM DD")}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Time Slot Selection */}
        {selectedDate && (
          <View className="mb-8">
            <Text className="text-black text-xl font-bold mb-4">
              Select Time
            </Text>
            <View className="flex-row flex-wrap">
              {groupedSlots[selectedDate].map((slot) => {
                const isSelected =
                  selectedTimeSlot?.timeslot_id === slot.timeslot_id;
                return (
                  <View key={slot.timeslot_id} className="w-1/2 p-1">
                    <TouchableOpacity
                      onPress={() => setSelectedTimeSlot(slot)}
                      className={`rounded-md px-6 py-3 ${isSelected
                        ? "bg-[#E86969]"
                        : "bg-white border border-gray-200"
                        }`}
                    >
                      <Text
                        className={`text-base text-center font-medium ${isSelected ? "text-white" : "text-gray-600"
                          }`}
                      >
                        {dayjs(slot.start_time).format("hh:mm A")}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Price Summary */}
        <View className="bg-[#E572721A] rounded-md p-4 mb-6">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-black text-lg font-bold">
              Total for {selectedPartySize} People
            </Text>
            <Text className="text-black text-xl font-bold">
              $
              {Number(deal?.price?.replace(/[^0-9.-]+/g, "") || 0) *
                selectedPartySize}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-500 text-sm">You save</Text>
            <Text className="text-green-600 text-sm font-semibold">
              $
              {(Number(deal?.originalPrice?.replace(/[^0-9.-]+/g, "") || 0) -
                Number(deal?.price?.replace(/[^0-9.-]+/g, "") || 0)) *
                selectedPartySize}
            </Text>
          </View>
        </View>

        {/* Confirm Button */}
        <TouchableOpacity
          className="bg-[#E86969] rounded-md py-4 mb-8"
          onPress={handleConfirmBooking}
          disabled={isSubmitting}
        >
          <Text className="text-white text-center font-bold text-lg">
            {isSubmitting ? "Processing..." : "Confirm Booking"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
