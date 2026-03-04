// @ts-nocheck
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RedeemScreen() {
  const router = useRouter();
  const voucherData = {
    voucherCode: "HLA8G4B9ZX4",
    dealTitle: "Bella Italia - Early Bird Special",
    dealDescription: "3-Course Italian Dinner",
    currentPrice: "$29",
    originalPrice: "$45",
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(auth)/login");
    }
  };

  const handleCopyCode = () => {
    console.log("Copied voucher code:", voucherData.voucherCode);
  };

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-row items-center justify-between px-4 py-4 relative">
        <View className="flex-row items-center space-x-4 ml-auto">
          <TouchableOpacity>
            <Feather name="bell" size={24} color="black" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 ml-2 bg-[#E86969] rounded-full items-center justify-center">
            <Text className="text-white font-semibold text-lg">A</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View className="flex-1 px-4">
        <View className="items-center mt-8 mb-8">
          <Text className="text-black text-2xl font-bold mb-2">
            Your Voucher QR Code
          </Text>
          <Text className="text-gray-400 text-base text-center mb-8">
            Present this code to the cashier
          </Text>
          <View className="bg-white border border-gray-200 rounded-xl w-full p-6 mx-4 mb-6">
            <Text className="text-black text-base font-medium text-center mb-4">
              Show this code at the restaurant:
            </Text>
            <View className="mx-auto">
              <Image
                source={require("../../assets/images/project/qr_code.jpg")}
                className="h-32 w-32"
              />
            </View>
          </View>
          <View className="flex-row items-center gap-2 w-full mb-6 mx-4">
            <View className="flex-1 border border-gray-200 rounded-lg px-4 py-3">
              <Text className="text-black font-mono text-sm">
                {voucherData.voucherCode}
              </Text>
            </View>
            <TouchableOpacity
              onPress={handleCopyCode}
              className="border border-gray-200 rounded-lg px-4 py-3"
            >
              <Feather name="copy" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="bg-[#E572721A] rounded-xl p-6 mb-8">
          <Text className="text-black text-xl font-bold text-center mb-4">
            Deal Details
          </Text>
          <Text className="text-black text-lg font-semibold text-center mb-2">
            {voucherData.dealTitle}
          </Text>
          <Text className="text-gray-600 text-base text-center mb-4">
            {voucherData.dealDescription}
          </Text>
          <View className="flex-row items-center justify-center">
            <Text className="text-[#E86969] text-2xl font-bold mr-3">
              {voucherData.currentPrice}
            </Text>
            <Text className="text-gray-400 text-lg line-through">
              (was {voucherData.originalPrice})
            </Text>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
