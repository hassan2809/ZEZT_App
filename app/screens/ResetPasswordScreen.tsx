// @ts-nocheck
import { resetPassword } from "@/src/services/auth.service";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams();

  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");
  const confirmPassword = watch("confirmPassword");
  const hasMinLength = password.length >= 7;
  const hasCapitalLetter = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Password Mismatch ❌",
        text2: "Passwords do not match. Please try again.",
      });
      return;
    }

    try {
      await resetPassword(email, data.password);

      Toast.show({
        type: "success",
        text1: "Password Reset ✅",
        text2: "Your password has been updated successfully.",
      });

      router.replace("/reset-successful");
    } catch (err) {
      console.error("Reset failed:", err);
      Toast.show({
        type: "error",
        text1: "Reset Failed ❌",
        text2: err?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView contentContainerClassName="flex-1 px-6">
        <View className="items-center mt-12">
          <Text className="text-black text-5xl font-bold">ZEZT</Text>
        </View>

        <View className="flex-1 justify-center">
          <View className="mb-8">
            <Text className="text-black text-3xl font-bold text-center mb-3">
              Reset Password
            </Text>
            <Text className="text-gray-500 text-base text-center">
              Create a new password
            </Text>
          </View>

          {/* Password */}
          <View className="mb-4">
            <Text className="text-black text-xl font-medium mb-2">
              Password <Text className="text-[#E86969]">*</Text>
            </Text>
            <View className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-row items-center">
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="flex-1 text-gray-600 text-base"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                  />
                )}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <FontAwesome5 name="eye" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View className="mb-6">
            <Text className="text-black text-xl font-medium mb-2">
              Confirm Password <Text className="text-[#E86969]">*</Text>
            </Text>
            <View className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-row items-center">
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    className="flex-1 text-gray-600 text-base"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Confirm your password"
                    secureTextEntry={!showConfirmPassword}
                  />
                )}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <FontAwesome5 name="eye" size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Password conditions */}
          <View className="flex-row">
            <View className="flex-1">
              <Text className="text-gray-700 text-base font-medium mb-3">
                Password must include:
              </Text>
              <View className="space-y-2">
                <View className="flex-row items-center mb-2">
                  <Feather
                    name={hasMinLength ? "check" : "x"}
                    size={16}
                    color={hasMinLength ? "#10B981" : "#EF4444"}
                  />
                  <Text
                    className={`ml-2 text-sm ${
                      hasMinLength ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    At least <Text className="font-semibold">7 Characters</Text>
                  </Text>
                </View>

                <View className="flex-row items-center mb-2">
                  <Feather
                    name={hasCapitalLetter ? "check" : "x"}
                    size={16}
                    color={hasCapitalLetter ? "#10B981" : "#EF4444"}
                  />
                  <Text
                    className={`ml-2 text-sm ${
                      hasCapitalLetter ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    At least{" "}
                    <Text className="font-semibold">one capital letter</Text>
                  </Text>
                </View>

                <View className="flex-row items-center mb-2">
                  <Feather
                    name={hasNumber ? "check" : "x"}
                    size={16}
                    color={hasNumber ? "#10B981" : "#EF4444"}
                  />
                  <Text
                    className={`ml-2 text-sm ${
                      hasNumber ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    At least <Text className="font-semibold">one number</Text>
                  </Text>
                </View>

                <View className="flex-row items-center">
                  <Feather
                    name={hasSpecialChar ? "check" : "x"}
                    size={16}
                    color={hasSpecialChar ? "#10B981" : "#EF4444"}
                  />
                  <Text
                    className={`ml-2 text-sm ${
                      hasSpecialChar ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    At least{" "}
                    <Text className="font-semibold">one special character</Text>
                  </Text>
                </View>
              </View>

              {/* Submit button */}
              <View className="justify-end mt-8">
                <TouchableOpacity
                  className={`rounded-lg px-8 py-4 ${
                    isSubmitting
                      ? "bg-gray-400"
                      : "bg-[#E86969]"
                  }`}
                  onPress={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  <Text className="text-white text-center text-xl font-semibold">
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
