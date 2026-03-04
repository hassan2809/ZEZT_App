// @ts-nocheck
import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Feather from "@expo/vector-icons/Feather";
import { useRouter, usePathname } from "expo-router";
import { useAuthStore } from "@/src/stores/auth.store";

export default function ScreenHeader({
  title = "",
  showBack = false,
  showBell = false,
  showAvatar = false,
  backTo = null,
}) {
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((state) => state.user)
  const userInitial = user?.firstName.slice(0, 1)
  const handleBack = () => {
    if (backTo) {
      router.push(backTo);
    } else {
      if (pathname.includes('deal-details') || pathname.includes('confirm-booking') || pathname.includes('booking-details')) {
        router.replace("/(tabs)");
      } else if (pathname.includes('modify-booking')) {
        router.replace("/(tabs)/bookings");
      } else {
        router.back();
      }
    }
  };

  return (
    <View className={`flex-row items-center justify-between px-4 py-4 relative ${!user ? "mb-3" : ""
      }`}>
      {showBack ? (
        <TouchableOpacity onPress={handleBack}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 24 }} />
      )}
      <View className="absolute left-0 right-0 items-center">
        <Text className="text-black text-2xl font-bold">{title}</Text>
      </View>
      <View className="flex-row items-center space-x-4 ml-auto">
        {showBell && (
          <TouchableOpacity>
            <Feather name="bell" size={24} color="black" />
          </TouchableOpacity>
        )}
        {showAvatar && user && (
          <TouchableOpacity className="w-10 h-10 ml-2 bg-[#E86969] rounded-full items-center justify-center">
            <Text className="text-white font-semibold text-lg">
              {userInitial?.toUpperCase() || "U"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}
