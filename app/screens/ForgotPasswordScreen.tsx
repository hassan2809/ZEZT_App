// @ts-nocheck

import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as authService from "../../src/services/auth.service";

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState("");
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      const response = await authService.forgotPassword(email);
      Toast.show({
        type: "success",
        text1: "Email Sent 📩",
        text2: "Check your inbox for the reset link",
      });

      router.navigate({
        pathname: "/verification-code",
        params: { email },
      });
    } catch (error) {
      console.error("Request failed:", error);
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: error.message || "Something went wrong, please try again.",
      });
    } finally {
      setIsSubmitting(false)
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerStyle={{ flex: 1, paddingHorizontal: 24 }}>
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
        <View className="flex-1 justify-center">
          <View className="mb-8">
            <Text className="text-black text-3xl font-bold text-center mb-3">
              Forget Password
            </Text>
            <Text className="text-gray-500 text-base text-center">
              Enter your email address
            </Text>
          </View>
          <View className="mb-8">
            <View className="mb-3">
              <Text className="text-black text-xl font-medium">
                Email <Text className="text-[#E86969]">*</Text>
              </Text>
            </View>
            <View className="bg-gray-50 border border-gray-200 rounded-lg p-2">
              <TextInput
                className="text-gray-600 text-base"
                value={email}
                onChangeText={setEmail}
                placeholder="ava.wright@gmail.com"
                keyboardType="email-address"
              />
            </View>
          </View>
          <TouchableOpacity
            className="bg-[#E86969] rounded-lg p-4"
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            <Text className="text-white text-center text-xl font-semibold">
              {isSubmitting ? 'Submitting' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
