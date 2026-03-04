// @ts-nocheck
import { useAuthStore } from "@/src/stores/auth.store";
import Entypo from "@expo/vector-icons/Entypo";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import * as authService from "../../src/services/auth.service";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const res = await authService.login(data);
      await useAuthStore.getState().setAuth({
        user: res.user,
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
      });

      reset();
      Toast.show({
        type: "success",
        text1: "Welcome back 👋",
        text2: "Login successful!",
      });
      router.replace("/(tabs)");
    } catch (err) {
      console.error("Login error:", err);
      Toast.show({
        type: "error",
        text1: "Login Failed",
        text2: err.message || "Invalid credentials. Try again.",
      });
    }
  };

  return (
    <SafeAreaView className="bg-white h-full flex justify-center">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerClassName="flex my-auto px-6">
          <View className="items-center mt-8 mb-12">
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
          <View className="mb-8">
            <Text className="text-black text-3xl font-bold text-center mb-2">
              Welcome!
            </Text>
            <Text className="text-gray-500 text-base text-center">
              Please login with your account
            </Text>
            <Text className="text-gray-500 text-base text-center">
              to continue
            </Text>
          </View>
          {/* <TouchableOpacity className="bg-white border border-[#E4E4E7] rounded-lg p-4 mb-6 shadow-lg">
            <View className="flex-row items-center justify-center">
              <Image
                source={require("../../assets/images/project/google.png")}
                className="h-6 w-6"
                resizeMode="contain"
              />
              <Text className="text-black text-lg font-medium ml-4">
                Continue with Google
              </Text>
            </View>
          </TouchableOpacity>
          <View className="flex-row items-center mb-6">
            <View className="flex-1 h-px bg-[#E4E4E7]" />
            <Text className="text-gray-400 text-sm mx-4">Login with email</Text>
            <View className="flex-1 h-px bg-[#E4E4E7]" />
          </View> */}
          <View className="mb-4">
            <Text className="text-black text-md font-medium mb-2">Email</Text>
            <Controller
              control={control}
              name="email"
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Invalid email address",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <View className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-row items-center">
                  <Feather name="mail" size={20} color="black" />
                  <TextInput
                    className="flex-1 pl-4 text-gray-600"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your email"
                    keyboardType="email-address"
                  />
                </View>
              )}
            />
            {errors.email && (
              <Text className="text-red-500 text-sm mt-2">
                {errors.email.message}
              </Text>
            )}
          </View>
          <View className="mb-4">
            <Text className="text-black text-md font-medium mb-2">
              Password
            </Text>
            <Controller
              control={control}
              name="password"
              rules={{ required: "Password is required" }}
              render={({ field: { onChange, value } }) => (
                <View className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-row items-center">
                  <Feather name="lock" size={20} color="black" />
                  <TextInput
                    className="flex-1 pl-4 text-gray-600"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Enter your password"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                  >
                    <FontAwesome5 name="eye" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text className="text-red-500 text-sm mt-2">
                {errors.password.message}
              </Text>
            )}
          </View>
          <View className="flex-row justify-between items-center mb-8">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                className={`w-5 h-5 flex justify-center items-center rounded mr-2 ${rememberMe ? "bg-[#E86969]" : "bg-gray-200"}`}
              >
                {rememberMe && <Entypo name="check" size={16} color="white" />}
              </View>
              <Text className="text-gray-700 text-md font-medium">
                Remember me
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => router.push("/(auth)/forgot-password")}
            >
              <Text className="text-[#E86969] underline text-md">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity
            className="bg-[#E86969] rounded-lg p-4 mb-6"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text className="text-white text-center text-md font-semibold">
              Login
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center items-center mb-8">
            <Text className="text-gray-500 text-md">Not registered yet? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signup")}>
              <Text className="text-[#E86969] text-md font-medium">
                Create an Account
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
