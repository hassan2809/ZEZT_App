// @ts-nocheck
import { getBookingDetails } from "@/src/services/booking.service";
import Feather from "@expo/vector-icons/Feather";
import { CommonActions } from "@react-navigation/native";
import dayjs from "dayjs";
import { useLocalSearchParams, useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function BookingDetailsScreen() {
  const router = useRouter();
  const navigation = useNavigation();
  // const { bookingId } = useLocalSearchParams();
  const { session_id } = useLocalSearchParams();
  const [bookingDetails, setBookingDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleDone = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [
          {
            name: "(tabs)",
            state: {
              index: 0,
              routes: [{ name: "index" }],
            },
          },
        ],
      })
    );
  };

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const data = await getBookingDetails(session_id);
        setBookingDetails(data);
      } catch (err) {
        console.log(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    if (session_id) {
      fetchBookingDetails();
    }
  }, [session_id]);

  const handleCopyCode = () => {
    console.log("Copied booking code:");
  };

  const bookingData = {
    dealName: "Bella Vista Italian",
    date: "Today",
    time: "7:00 PM",
    party: "2 people",
    location: "123 Main St, Downtown",
    bookingCode: "HLA8G4B9ZX4",
  };

  if (loading || !bookingDetails) {
    return (
      <View className="bg-white flex-1 items-center justify-center">
        <Text className="text-gray-500 text-lg">Loading booking details...</Text>
      </View>
    );
  }

  return (
    <View className="bg-white flex-1">
      <View className="flex-1">
        <ImageBackground
          source={require("../../assets/images/project/Pattern.png")}
        >
          <View className="items-center mt-20 mb-12">
            <Text className="text-black text-3xl font-bold mb-2">Great!</Text>
            <Text className="text-gray-400 text-lg">You're booked! 🎉</Text>
          </View>
          <View className="bg-[#E572721A] rounded-xl p-6 mb-8 mx-4">
            <Text className="text-black text-xl font-bold text-center mb-6">
              {bookingDetails?.deal?.restaurant?.name}
            </Text>
            <View className="space-y-4">
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-base">Date</Text>
                <Text className="text-black text-base font-medium">
                  {bookingDetails?.timeslot?.start_time
                    ? dayjs(bookingDetails.timeslot.start_time).format(
                        "MMMM D, YYYY"
                      )
                    : ""}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-base">Time</Text>
                <Text className="text-black text-base font-medium">
                  {bookingDetails?.timeslot?.start_time
                    ? dayjs(bookingDetails.timeslot.start_time).format("h:mm A")
                    : ""}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-base">Party</Text>
                <Text className="text-black text-base font-medium">
                  {bookingDetails?.party_size}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="text-gray-500 text-base">Location</Text>
                <Text className="text-black text-base font-medium text-right flex-1 ml-4">
                  {bookingDetails?.deal?.restaurant?.address.street}
                </Text>
              </View>
            </View>
          </View>
        </ImageBackground>
        <View className="bg-white border border-gray-200 rounded-xl p-6 mx-4 mb-6">
          <Text className="text-black text-base font-medium text-center mb-4">
            Show this code at the restaurant:
          </Text>
          <View className="mx-auto">
            <Image
              source={{ uri: bookingDetails?.qr_code }}
              className="h-32 w-32"
            />
          </View>
        </View>
        <View className="flex-row items-center gap-2 mb-6 mx-4">
          <View className="flex-1 border border-gray-200 rounded-lg px-4 py-3">
            <Text className="text-black font-mono text-sm">
              {bookingData.bookingCode}
            </Text>
          </View>
          <TouchableOpacity
            onPress={handleCopyCode}
            className="border border-gray-200 rounded-lg px-4 py-3"
          >
            <Feather name="copy" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        {/* <TouchableOpacity
          className="bg-[#E86969] rounded-xl py-4 mb-8 mx-4"
          onPress={handleDone}
        >
          <Text className="text-white text-center font-bold text-lg">Done</Text>
        </TouchableOpacity> */}
      </View>
    </View>
  );
}
