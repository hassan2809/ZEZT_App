// @ts-nocheck
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

export default function SignupScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      password: "",
      confirmPassword: "",
    },
  });
  const passwordValue = watch("password");

  const onSubmit = async (data) => {
    try {
      const res = await authService.register(data);
      reset();
      router.navigate("/login");
      Toast.show({
        type: "success",
        text1: "Signup Successful 🎉",
        text2: "You can now log in with your account",
      });
    } catch (err) {
      console.error("Signup error:", err);
      Toast.show({
        type: "error",
        text1: "Signup Failed",
        text2: err.error || "Something went wrong, please try again.",
      });
    }
  };

  return (
    <SafeAreaView className="bg-white">
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
              Create an account 👋
            </Text>
            <Text className="text-gray-500 text-base text-center">
              Please create using the form below.
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
            <Text className="text-gray-400 text-sm mx-4">
              Create account with
            </Text>
            <View className="flex-1 h-px bg-[#E4E4E7]" />
          </View> */}
          <View className="flex-row mb-4 gap-4">
            <View className="flex-1">
              <Text className="text-black text-md font-medium mb-2">
                First Name
              </Text>
              <Controller
                control={control}
                name="firstName"
                rules={{ required: "First name is required" }}
                render={({ field: { onChange, value } }) => (
                  <View className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-row items-center">
                    <Feather name="user" size={20} color="black" />
                    <TextInput
                      className="flex-1 pl-4 text-gray-600"
                      value={value}
                      onChangeText={onChange}
                      placeholder="John"
                    />
                  </View>
                )}
              />
              {errors.firstName && (
                <Text className="text-red-500 text-sm mt-2">
                  {errors.firstName.message}
                </Text>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-black text-md font-medium mb-2">
                Last Name
              </Text>
              <Controller
                control={control}
                name="lastName"
                rules={{ required: "Last name is required" }}
                render={({ field: { onChange, value } }) => (
                  <View className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-row items-center">
                    <Feather name="user" size={20} color="black" />
                    <TextInput
                      className="flex-1 pl-4 text-gray-600"
                      value={value}
                      onChangeText={onChange}
                      placeholder="Miles"
                    />
                  </View>
                )}
              />
              {errors.lastName && (
                <Text className="text-red-500 text-sm mt-2">
                  {errors.lastName.message}
                </Text>
              )}
            </View>
          </View>
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
                    placeholder="john@example.com"
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
              Phone Number
            </Text>
            <Controller
              control={control}
              name="phoneNumber"
              rules={{
                required: "Phone number is required",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "Invalid phone number",
                },
              }}
              render={({ field: { onChange, value } }) => (
                <View className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-row items-center">
                  <Feather name="phone" size={20} color="black" />
                  <TextInput
                    className="flex-1 pl-4 text-gray-600"
                    value={value}
                    onChangeText={onChange}
                    placeholder="03001234567"
                    keyboardType="phone-pad"
                  />
                </View>
              )}
            />
            {errors.phoneNumber && (
              <Text className="text-red-500 text-sm mt-2">
                {errors.phoneNumber.message}
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
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              }}
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
          <View className="mb-4">
            <Text className="text-black text-md font-medium mb-2">
              Confirm Password
            </Text>
            <Controller
              control={control}
              name="confirmPassword"
              rules={{
                required: "Please confirm your password",
                validate: (value) =>
                  value === passwordValue || "Passwords do not match",
              }}
              render={({ field: { onChange, value } }) => (
                <View className="bg-gray-50 border border-gray-200 rounded-lg p-2 flex-row items-center">
                  <Feather name="lock" size={20} color="black" />
                  <TextInput
                    className="flex-1 pl-4 text-gray-600"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Confirm your password"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <FontAwesome5 name="eye" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.confirmPassword && (
              <Text className="text-red-500 text-sm mt-2">
                {errors.confirmPassword.message}
              </Text>
            )}
          </View>

          <View className="mb-8">
            <View className="flex-row items-center">
              <Controller
                control={control}
                name="termsAccepted"
                rules={{ required: "You must accept the terms" }}
                render={({ field: { value, onChange } }) => (
                  <TouchableOpacity
                    className="flex-row items-center"
                    onPress={() => {
                      onChange(!value);
                      setTermsAccepted(!value);
                    }}
                  >
                    <View
                      className={`w-5 h-5 flex justify-center items-center rounded mr-2 ${value ? "bg-[#E86969]" : "bg-gray-200"
                        }`}
                    >
                      {value && <Entypo name="check" size={16} color="white" />}
                    </View>
                    <Text className="text-gray-700 text-md font-medium">
                      Terms and Conditions
                    </Text>
                  </TouchableOpacity>
                )}
              />
            </View>

            {errors.termsAccepted && (
              <Text className="text-red-500 text-sm mt-1">
                {errors.termsAccepted.message}
              </Text>
            )}
          </View>

          <TouchableOpacity
            className="bg-[#E86969] rounded-lg p-4 mb-6"
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          >
            <Text className="text-white text-center text-md font-semibold">
              Create an account
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center items-center mb-8">
            <Text className="text-gray-500 text-md">
              Already have an account?{" "}
            </Text>
            <TouchableOpacity onPress={() => navigate("/login")}>
              <Text className="text-[#E86969] text-md font-medium">
                Sign in
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
