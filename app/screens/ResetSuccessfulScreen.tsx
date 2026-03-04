import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PasswordResetSuccessScreen() {
  const router = useRouter();

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="flex-1 px-6">
        <View className="items-center mt-12">
          <View className="flex-row items-center mb-2">
            {/* Replace with your actual logo */}
            {/* <Image
                  source={require("../../assets/images/project/logo.png")}
                  className="w-[400px] h-[400px] mb-3"
                  resizeMode="contain"
                /> */}
            <Text className="text-black text-5xl font-bold">ZEZT</Text>
          </View>
        </View>
        <View className="flex-1 justify-center items-center">
          <View className="w-20 h-20 bg-green-600 rounded-full items-center justify-center mb-8">
            <Feather name="check" size={40} color="white" />
          </View>
          <Text
            style={{ fontSize: 26 }}
            className="text-green-600 font-bold mb-3"
          >
            Password Reset Successfuly
          </Text>
          <Text className="text-gray-500 text-base text-center mb-12">
            Sign In Your Account
          </Text>
          <TouchableOpacity
            className="bg-[#E86969] rounded-lg py-4 px-12 w-full"
            onPress={() => router.push("/(auth)/login")}
          >
            <Text className="text-white text-center text-xl font-semibold">
              Go to login page
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
