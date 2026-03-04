// @ts-nocheck
import { verifyCode } from "@/src/services/auth.service";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function VerificationCodeScreen() {
  const { email } = useLocalSearchParams();
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleCodeChange = (value, index) => {
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    try {
      setIsSubmitting(false)
      const enteredCode = code.join("");
      const response = await verifyCode(email, enteredCode);

      Toast.show({
        type: "success",
        text1: "Code Verified ✅",
        text2: "You can now reset your password.",
      });

      router.push({ pathname: "/reset-password", params: { email } });
    } catch (err: any) {
      console.error("Verification failed:", err);

      Toast.show({
        type: "error",
        text1: "Verification Failed ❌",
        text2: err?.message || "Invalid or expired code. Please try again.",
      });
    } finally {
      setIsSubmitting(false)
    }
  };

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
        <View className="flex-1 justify-center">
          <View className="mb-8">
            <Text className="text-black text-3xl font-bold text-center mb-3">
              Enter Verification Code
            </Text>
            <Text className="text-gray-500 text-base text-center">
              Enter 6-Digit Code to Retrieve password
            </Text>
          </View>
          <View className="mb-4">
            <View className="flex-row justify-between mb-4">
              {code.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  className="w-12 h-12 bg-gray-50 border border-gray-200 rounded-lg text-center text-xl font-semibold text-black"
                  value={digit}
                  onChangeText={(value) => handleCodeChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  maxLength={1}
                  selectTextOnFocus={true}
                />
              ))}
            </View>
          </View>
          <View className="flex-row gap-4">
            <TouchableOpacity className="flex-1 bg-white border border-gray-200 rounded-lg p-4">
              <Text className="text-gray-700 text-center text-xl font-semibold">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 bg-[#E86969] rounded-lg p-4"
              onPress={handleVerify}
              disabled={isSubmitting}
            >
              <Text className="text-white text-center text-xl font-semibold">
                {isSubmitting ? 'Verifying' : 'Verify'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
