// @ts-nocheck
import { getAllChats } from "@/src/services/chat.service";
import { useAuthStore } from "@/src/stores/auth.store";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";

export default function ChatScreen() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user;
  const [chatHistory, setChatHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const fetchChatsOfCustomer = async () => {
        try {
          setLoading(true);
          const data = await getAllChats();
          const mappedChats = data.map((chat) => ({
            id: chat.roomId,
            userName: chat.restaurant?.name || "Unknown",
            userInitial: chat.restaurant?.name?.[0]?.toUpperCase() || "U",
            lastMessage: chat.lastMessage || "No messages yet",
            timestamp: new Date(chat.lastActivity).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
            unreadCount: 0,
            roomId: chat.roomId,
          }));
          setChatHistory(mappedChats);
        } catch (err) {
          console.log(err.message || "Something went wrong");
        } finally {
          setLoading(false);
        }
      };

      if (user) {
        fetchChatsOfCustomer();
      }
    }, [])
  );

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(auth)/login");
    }
  };

  const handleChatPress = (chat) => {
    const encodedUserName = encodeURIComponent(chat.userName);
    const encodedUserInitial = encodeURIComponent(chat.userInitial);
    router.push(`/chat/${chat.roomId}?userName=${encodedUserName}&userInitial=${encodedUserInitial}`);
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleChatPress(item)}
      className="bg-white border border-gray-200 rounded-xl p-4 mb-4 mx-4"
    >
      <View className="flex-row items-center">
        <View className="w-12 h-12 bg-[#E86969] rounded-full items-center justify-center mr-4">
          <Text className="text-white font-semibold text-lg">
            {item.userInitial}
          </Text>
        </View>
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-black text-lg font-bold">
              {item.userName}
            </Text>
            <Text className="text-gray-400 text-sm">
              {item.timestamp}
            </Text>
          </View>
          <View className="flex-row items-center justify-between">
            <Text className="text-gray-600 text-base flex-1 mr-2" numberOfLines={1}>
              {item.lastMessage.text}
            </Text>
            {item.unreadCount > 0 && (
              <View className="bg-[#E86969] rounded-full min-w-[20px] h-5 items-center justify-center px-1">
                <Text className="text-white text-xs font-semibold">
                  {item.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView className="bg-white flex-1 items-center justify-center">
        <Text className="text-gray-500 text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <ScreenHeader title="Chat" showAvatar/>
      <View className="flex-1">
        <View className="px-4 mb-4">
          <Text className="text-gray-400 text-base text-center">
            Your recent conversations
          </Text>
        </View>

        <FlatList
          data={chatHistory}
          keyExtractor={(item) => item.id}
          renderItem={renderChatItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>
    </SafeAreaView>
  );
}