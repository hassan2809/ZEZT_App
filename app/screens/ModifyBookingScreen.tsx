// @ts-nocheck
import { updateBooking, getSingleBooking, getBookingDetails } from "@/src/services/booking.service";
import { getTimeSlotsOfDeal } from "@/src/services/deal.service";
import { useAuthStore } from "@/src/stores/auth.store";
import dayjs from "dayjs";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { BackHandler, ScrollView, Text, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import Feather from "@expo/vector-icons/Feather";
import { Portal, Dialog, Button, Paragraph } from "react-native-paper";
import ScreenHeader from "../components/ScreenHeader";

export default function ModifyBookingScreen() {
    const { bookingId } = useLocalSearchParams();
    const router = useRouter();
    const [selectedPartySize, setSelectedPartySize] = useState(2);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);
    const [booking, setBooking] = useState(null);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(false);
    const user = useAuthStore((state) => state.user);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [dialogType, setDialogType] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false)

    useEffect(() => {
        const fetchBookingDetails = async () => {
            try {
                const bookingData = await getBookingDetails(bookingId);
                setBooking(bookingData);
                setSelectedPartySize(bookingData.party_size);
                const bookingDate = dayjs(bookingData.timeslot.start_time).format("YYYY-MM-DD");
                setSelectedDate(bookingDate);
                setSelectedTimeSlot(bookingData.timeslot);
                const slotsData = await getTimeSlotsOfDeal(bookingData?.deal?.id);
                setSlots(slotsData?.timeslots || []);
            } catch (err) {
                console.log(err.message || "Something went wrong");
                Toast.show({
                    type: "error",
                    text1: "Error",
                    text2: "Failed to load booking details",
                });
            }
        };

        if (bookingId) {
            fetchBookingDetails();
        }
    }, [bookingId]);

    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => {
                router.replace("/(tabs)/bookings");
                return true;
            };

            const subscription = BackHandler.addEventListener(
                "hardwareBackPress",
                onBackPress
            );

            return () => subscription?.remove();
        }, [router])
    );

    const partySizes = Array.from(
        { length: selectedTimeSlot?.available_seats || booking?.time_slot_id?.available_seats || 0 },
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

    const handleModifyBooking = async () => {
        if (!selectedDate || !selectedTimeSlot) {
            Toast.show({
                type: "error",
                text1: "Missing Selection",
                text2: "Please select both date and time slot",
            });
            return;
        }

        const originalDate = dayjs(booking.timeslot.start_time).format("YYYY-MM-DD");
        const hasChanges =
            selectedDate !== originalDate ||
            selectedTimeSlot.id !== booking.timeslot.id ||
            selectedPartySize !== booking.party_size;

        if (!hasChanges) {
            Toast.show({
                type: "info",
                text1: "No Changes",
                text2: "No modifications were made to your booking",
            });
            return;
        }

        setDialogType("modify");
        setDialogVisible(true);
    };

    const handleCancelBooking = () => {
        setDialogType("cancel");
        setDialogVisible(true);
    };

    const confirmModification = async () => {
        setLoading(true);
        try {
            let newTimeslotId;
            if (selectedTimeSlot?.timeslot_id === booking?.timeslot?.id) {
                newTimeslotId = booking?.timeslot?.id;
            } else {
                newTimeslotId = selectedTimeSlot?.timeslot_id || selectedTimeSlot?.id;
            }

            const payload = {
                newTimeslotId,
                party_size: selectedPartySize,
            };
            await updateBooking(booking.booking_id, payload);
            Toast.show({
                type: "success",
                text1: "Booking Modified",
                text2: "Your booking has been successfully updated",
            });

            router.replace("/(tabs)/bookings");
        } catch (error) {
            Toast.show({
                type: "error",
                text1: "Modification Failed",
                text2: error.message || "Something went wrong",
            });
        } finally {
            setLoading(false);
        }
    };

    if (!booking) {
        return (
            <SafeAreaView className="bg-white flex-1 items-center justify-center" edges={["top"]}>
                <Text className="text-gray-500 text-lg">Loading booking details...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="bg-white flex-1" edges={["top"]}>
            <ScreenHeader title="Modify Booking" showBack />

            <ScrollView className="flex-1 px-4" showsVerticalScrollIndicator={false}>
                {/* Deal Info */}
                <View className="bg-gray-50 rounded-lg p-4 mb-6">
                    <Text className="text-black text-xl font-bold mb-2">
                        {booking?.deal?.title}
                    </Text>
                    <View className="flex-row items-center mb-1">
                        <Feather name="map-pin" size={14} color="#9CA3AF" />
                        <Text className="text-gray-500 text-sm ml-2">
                            {booking?.deal?.restaurant?.address?.street}
                        </Text>
                    </View>
                    <View className="flex-row items-center">
                        <Feather name="calendar" size={14} color="#9CA3AF" />
                        <Text className="text-gray-500 text-sm ml-2">
                            Original: {dayjs(booking?.timeslot?.start_time).format("MMM DD, YYYY hh:mm A")}
                        </Text>
                    </View>
                </View>

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
                                    setSelectedTimeSlot(null); // reset timeslot when date changes
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
                            {groupedSlots[selectedDate]?.map((slot) => {
                                const isSelected =
                                    selectedTimeSlot?.timeslot_id === slot.timeslot_id;
                                const isOriginalSlot =
                                    booking.timeslot.id === slot.timeslot_id;
                                return (
                                    <View key={slot.timeslot_id} className="w-1/2 p-1">
                                        <TouchableOpacity
                                            onPress={() => setSelectedTimeSlot(slot)}
                                            className={`rounded-md px-6 py-3 ${isSelected
                                                ? "bg-[#E86969]"
                                                : isOriginalSlot
                                                    ? "bg-blue-100 border border-blue-300"
                                                    : "bg-white border border-gray-200"
                                                }`}
                                        >
                                            <Text
                                                className={`text-base text-center font-medium ${isSelected
                                                    ? "text-white"
                                                    : isOriginalSlot
                                                        ? "text-blue-600"
                                                        : "text-gray-600"
                                                    }`}
                                            >
                                                {dayjs(slot.start_time).format("hh:mm A")}
                                                {isOriginalSlot && !isSelected && (
                                                    <Text className="text-xs"> (Current)</Text>
                                                )}
                                            </Text>
                                        </TouchableOpacity>
                                    </View>
                                );
                            })}
                        </View>
                    </View>
                )}

                {/* Updated Price Summary */}
                <View className="bg-[#E572721A] rounded-md p-4 mb-6">
                    <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-black text-lg font-bold">
                            Updated Total for {selectedPartySize} People
                        </Text>
                        <Text className="text-black text-xl font-bold">
                            $
                            {Number(booking?.deal.price || 0) *
                                selectedPartySize}
                        </Text>
                        <Text>{booking?.cost}</Text>
                    </View>
                    {booking && booking?.cost !== ((booking?.deal?.price || 0) * selectedPartySize) && (
                        <View className="flex-row items-center justify-end">
                            <Text className={`text-sm font-semibold line-through ${(booking?.deal.price * selectedPartySize) > booking.cost
                                ? "text-red-600"
                                : "text-green-600"
                                }`}>
                                ${((booking?.deal.price * selectedPartySize) - (booking?.deal.discount * selectedPartySize))}
                            </Text>
                        </View>
                    )}
                </View>

                {/* Action Buttons */}
                <View className="mb-8 ">
                    <TouchableOpacity
                        className={`rounded-md py-4 ${loading ? "bg-gray-400" : "bg-[#E86969]"}`}
                        onPress={handleModifyBooking}
                        disabled={loading}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {loading ? "Updating..." : "Save Changes"}
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        className="bg-white border border-red-400 rounded-md py-4 hidden"
                        onPress={handleCancelBooking}
                        disabled={loading}
                    >
                        <Text className="text-red-600 text-center font-bold text-lg">
                            Cancel Booking
                        </Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <Portal>
                <Dialog
                    visible={dialogVisible}
                    onDismiss={() => setDialogVisible(false)}
                >
                    <Dialog.Title>
                        {dialogType === "modify" ? "Confirm Modification" : "Cancel Booking"}
                    </Dialog.Title>
                    <Dialog.Content>
                        <Paragraph>
                            {dialogType === "modify"
                                ? "Are you sure you want to modify this booking?"
                                : "Are you sure you want to cancel this booking? This action cannot be undone."}
                        </Paragraph>
                    </Dialog.Content>
                    <Dialog.Actions>
                        <Button onPress={() => setDialogVisible(false)}>Cancel</Button>
                        <Button
                            onPress={() => {
                                setDialogVisible(false);
                                if (dialogType === "modify") {
                                    confirmModification();
                                } else {
                                    Toast.show({
                                        type: "success",
                                        text1: "Booking Cancelled",
                                        text2: "Your booking has been cancelled",
                                    });
                                    router.back();
                                }
                            }}
                        >
                            {dialogType === "modify" ? "Modify" : "Cancel Booking"}
                        </Button>
                    </Dialog.Actions>
                </Dialog>
            </Portal>
        </SafeAreaView>
    );
}