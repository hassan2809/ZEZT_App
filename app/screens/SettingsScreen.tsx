// @ts-nocheck
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  BackHandler,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";

export default function SettingsScreen() {
  const router = useRouter();
  const [notifications, setNotifications] = useState({
    dealAlerts: true,
    bookingReminders: true,
    loyaltyUpdates: false,
  });

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/(tabs)/account");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );
      return () => subscription.remove();
    }, [])
  );

  const [preferences, setPreferences] = useState({
    defaultPartySize: 2,
    maximumDistance: 5,
  });

  const toggleNotification = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const updatePartySize = (increment) => {
    setPreferences((prev) => ({
      ...prev,
      defaultPartySize: Math.max(
        1,
        Math.min(10, prev.defaultPartySize + increment)
      ),
    }));
  };

  const updateMaxDistance = (increment) => {
    setPreferences((prev) => ({
      ...prev,
      maximumDistance: Math.max(
        1,
        Math.min(50, prev.maximumDistance + increment)
      ),
    }));
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScreenHeader title="Settings" showBack showAvatar backTo="/account" />
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="mx-4 mt-6 mb-6">
          <View className="bg-white border border-gray-200 rounded-xl p-6">
            <Text className="text-black text-2xl font-bold mb-6">
              Notifications
            </Text>
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-1">
                <Text className="text-black text-lg font-semibold mb-1">
                  Deal Alerts
                </Text>
                <Text className="text-gray-500 text-sm">
                  Get notified about new deals nearby
                </Text>
              </View>
              <TouchableOpacity
                className={`w-12 h-7 rounded-full ${notifications.dealAlerts ? "bg-[#E86969]" : "bg-gray-300"
                  }`}
                onPress={() => toggleNotification("dealAlerts")}
              >
                <View
                  className={`w-5 h-5 bg-white rounded-full mt-1 ${notifications.dealAlerts ? "ml-6" : "ml-1"
                    }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-1">
                <Text className="text-black text-lg font-semibold mb-1">
                  Booking Reminders
                </Text>
                <Text className="text-gray-500 text-sm">
                  Reminders before your reservations
                </Text>
              </View>
              <TouchableOpacity
                className={`w-12 h-7 rounded-full ${notifications.bookingReminders
                    ? "bg-[#E86969]"
                    : "bg-gray-300"
                  }`}
                onPress={() => toggleNotification("bookingReminders")}
              >
                <View
                  className={`w-5 h-5 bg-white rounded-full mt-1 ${notifications.bookingReminders ? "ml-6" : "ml-1"
                    }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-black text-lg font-semibold mb-1">
                  Loyalty Updates
                </Text>
                <Text className="text-gray-500 text-sm">
                  Points and tier notifications
                </Text>
              </View>
              <TouchableOpacity
                className={`w-12 h-7 rounded-full ${notifications.loyaltyUpdates ? "bg-[#E86969]" : "bg-gray-300"
                  }`}
                onPress={() => toggleNotification("loyaltyUpdates")}
              >
                <View
                  className={`w-5 h-5 bg-white rounded-full mt-1 ${notifications.loyaltyUpdates ? "ml-6" : "ml-1"
                    }`}
                  style={{
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.2,
                    shadowRadius: 2,
                    elevation: 2,
                  }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="mx-4 mb-8">
          <View className="bg-white border border-gray-200 rounded-xl p-6">
            <Text className="text-black text-2xl font-bold mb-6">
              Preferences
            </Text>
            <View className="mb-6">
              <Text className="text-black text-lg font-semibold mb-4">
                Default Party Size
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="w-10 h-10 border border-gray-200 rounded-md items-center justify-center"
                  onPress={() => updatePartySize(-1)}
                >
                  <Text className="text-gray-600 text-xl font-bold">-</Text>
                </TouchableOpacity>

                <View className="mx-8 min-w-10 items-center">
                  <Text className="text-black text-2xl font-bold">
                    {preferences.defaultPartySize}
                  </Text>
                </View>

                <TouchableOpacity
                  className="w-10 h-10 border border-gray-200 rounded-md items-center justify-center"
                  onPress={() => updatePartySize(1)}
                >
                  <Text className="text-gray-600 text-xl font-bold">+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View>
              <Text className="text-black text-lg font-semibold mb-4">
                Maximum Distance (miles)
              </Text>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className="w-10 h-10 border border-gray-200 rounded-md items-center justify-center"
                  onPress={() => updateMaxDistance(-1)}
                >
                  <Text className="text-gray-600 text-xl font-bold">-</Text>
                </TouchableOpacity>

                <View className="mx-8 min-w-10 items-center">
                  <Text className="text-black text-2xl font-bold">
                    {preferences.maximumDistance}
                  </Text>
                </View>
                <TouchableOpacity
                  className="w-10 h-10 border border-gray-200 rounded-md items-center justify-center"
                  onPress={() => updateMaxDistance(1)}
                >
                  <Text className="text-gray-600 text-xl font-bold">+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
