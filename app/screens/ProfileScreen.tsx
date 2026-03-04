// @ts-nocheck
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
  BackHandler,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";
import { useForm, Controller } from "react-hook-form";
import client from "@/src/api/client";
import Toast from "react-native-toast-message";

export default function ProfileScreen() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const { control, handleSubmit, watch, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      oldPassword: "",
      newPassword: "",
    },
  });

  const firstName = watch("firstName");
  const lastName = watch("lastName");

  useFocusEffect(
    useCallback(() => {
      const fetchProfile = async () => {
        try {
          setLoading(true);
          const response = await client.get("/user/profile");
          const data = response.data.user;

          reset({
            firstName: data?.firstName,
            lastName: data?.lastName,
            email: data?.email,
            oldPassword: "",
            newPassword: "",
          });
        } catch (err) {
          console.error("Error loading profile:", err);
        } finally {
          setLoading(false);
        }
      };

      fetchProfile();
    }, [reset])
  );

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

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(auth)/login");
    }
  };

  const handleSaveProfile = async (formData) => {
    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
      };

      if (formData.oldPassword && formData.newPassword) {
        payload.oldPassword = formData.oldPassword;
        payload.newPassword = formData.newPassword;
      }

      const response = await client.put("/user/profile", payload);

      const responseData = response.data;
      const updatedUser = responseData?.user;
      
      if (updatedUser) {
        reset({
          firstName: updatedUser.firstName || formData.firstName,
          lastName: updatedUser.lastName || formData.lastName,
          email: updatedUser.email || formData.email, 
          oldPassword: "",
          newPassword: "",
        });
      }

      const successMessage = responseData?.message || "Your profile has been successfully updated";
      
      Toast.show({
        type: "success",
        text1: "Profile Updated",
        text2: successMessage,
      });
    } catch (error) {
      console.error("Error updating profile:", error.error || error.message);
      const errorData = error.response?.data;
      let errorMessage = "Failed to update profile. Please try again.";
      
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2: errorMessage,
      });
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white flex-1 items-center justify-center">
        <Text className="text-gray-500 text-lg">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white">
      <ScreenHeader title="Profile" showBack showAvatar backTo="/account" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="items-center mt-6 mb-8">
          <View className="relative">
            <View className="w-32 h-32 bg-[#E86969] rounded-full items-center justify-center">
              <Text className="text-white text-5xl font-bold">{(firstName?.[0] || "U").toUpperCase()}</Text>
            </View>
            {/* <TouchableOpacity
              className="absolute bottom-0 right-0 w-10 h-10 bg-black rounded-full items-center justify-center border-4 border-white"
              onPress={handleEditPhoto}
            >
              <Feather name="edit-2" size={16} color="white" />
            </TouchableOpacity> */}
          </View>
          <Text className="text-black text-2xl font-bold mt-4">
            {firstName} {lastName}
          </Text>
        </View>

        <View className="px-4">
          <View className="flex-row mb-6 gap-4">
            <View className="flex-1">
              <Text className="text-black text-lg font-semibold mb-2">
                First Name
              </Text>
              <Controller
                control={control}
                name="firstName"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <Feather name="user" size={20} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 ml-3 text-gray-700 text-base"
                      value={value}
                      onChangeText={onChange}
                      placeholder="First Name"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                )}
              />
            </View>

            <View className="flex-1">
              <Text className="text-black text-lg font-semibold mb-2">
                Last Name
              </Text>
              <Controller
                control={control}
                name="lastName"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <Feather name="user" size={20} color="#9CA3AF" />
                    <TextInput
                      className="flex-1 ml-3 text-gray-700 text-base"
                      value={value}
                      onChangeText={onChange}
                      placeholder="Last Name"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                )}
              />
            </View>
          </View>

          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value } }) => (
              <View className="mb-6">
                <Text className="text-black text-lg font-semibold mb-2">Email</Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <Feather name="mail" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-700 text-base"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Email"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                </View>
              </View>
            )}
          />

          <Controller
            control={control}
            name="oldPassword"
            render={({ field: { onChange, value } }) => (
              <View className="mb-6">
                <Text className="text-black text-lg font-semibold mb-2">Current Password</Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <Feather name="lock" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-700 text-base"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Current Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Feather
                      name={showPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, value } }) => (
              <View className="mb-8">
                <Text className="text-black text-lg font-semibold mb-2">
                  New Password
                </Text>
                <View className="flex-row items-center bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                  <Feather name="lock" size={20} color="#9CA3AF" />
                  <TextInput
                    className="flex-1 ml-3 text-gray-700 text-base"
                    value={value}
                    onChangeText={onChange}
                    placeholder="Confirm Password"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={!showConfirmPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <Feather
                      name={showConfirmPassword ? "eye-off" : "eye"}
                      size={20}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <TouchableOpacity
            className={`rounded-xl py-4 mb-8 ${isSubmitting ? "bg-gray-400" : "bg-[#E86969]"}`}
            onPress={handleSubmit(handleSaveProfile)}
            disabled={isSubmitting}
          >
            <Text className="text-white text-center font-bold text-lg">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
