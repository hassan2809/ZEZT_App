// @ts-nocheck
import { useAuthStore } from "@/src/stores/auth.store";
import Feather from "@expo/vector-icons/Feather";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import {
  Button,
  Dialog,
  Paragraph,
  Portal,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";

export default function AccountScreen() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const showDialog = () => setVisible(true);
  const hideDialog = () => setVisible(false);

  const handleLogout = () => {
    useAuthStore.getState().logout();
    hideDialog();
    router.replace("/(auth)/login");
  };

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(auth)/login");
    }
  };

  const handleProfilePress = () => {
    router.push("/(tabs)/(account)/profile");
  };

  const handleInviteFriendPress = () => {
    console.log("Navigate to Invite Friend");
  };

  const handleSettingsPress = () => {
    router.push("/(tabs)/(account)/settings");
  };

  const menuItems = [
    {
      id: 1,
      title: "Profile",
      icon: "users",
      onPress: handleProfilePress,
    },
    {
      id: 2,
      title: "Invite Friend",
      icon: "share-2",
      onPress: handleInviteFriendPress,
    },
    {
      id: 3,
      title: "Settings",
      icon: "settings",
      onPress: handleSettingsPress,
    },
  ];

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScreenHeader title="Account" showAvatar/>
      <View className="flex-1 px-4">
        <View className="mt-6">
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl p-4 mb-4"
              onPress={item.onPress}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.05,
                shadowRadius: 2,
                elevation: 1,
              }}
            >
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-full items-center justify-center mr-4">
                  <Feather name={item.icon} size={20} color="#9CA3AF" />
                </View>
                <Text className="text-black text-lg font-medium">
                  {item.title}
                </Text>
              </View>
              <Feather name="chevron-right" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Log Out Button */}
        <View className="mt-8">
          <TouchableOpacity
            className="bg-[#E86969] rounded-xl py-4"
            onPress={showDialog}
          >
            <Text className="text-white text-center font-bold text-lg">
              Log out
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Portal>
        <Dialog visible={visible} onDismiss={hideDialog}>
          <Dialog.Title>Log Out</Dialog.Title>
          <Dialog.Content>
            <Paragraph>Are you sure you want to log out?</Paragraph>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={hideDialog}>Cancel</Button>
            <Button textColor="red" onPress={handleLogout}>
              Log Out
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </SafeAreaView>
  );
}
