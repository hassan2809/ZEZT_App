// @ts-nocheck
import Feather from "@expo/vector-icons/Feather";
import { useRouter, useLocalSearchParams } from "expo-router";
import { FlatList, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCallback, useEffect, useRef, useState } from "react";
import { connectSocket, disconnectSocket, getSingleChatHistory, getSocket } from "@/src/services/chat.service";
import { useAuthStore } from "@/src/stores/auth.store";
import { useFocusEffect } from "@react-navigation/native";

export default function ChatHistoryScreen() {
  const router = useRouter();
  const { chatId, userName, userInitial } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef(null);

  useFocusEffect(
    useCallback(() => {
      if (!user?._id || !chatId) {
        console.log("Missing user._id or chatId, returning early");
        return;
      }

      const socket = connectSocket(user._id);
      socket.emit("join_room", { roomId: chatId, userId: user._id });

      (async () => {
        try {
          setLoading(true);
          const history = await getSingleChatHistory(chatId);
          if (history.messages && Array.isArray(history.messages)) {
            const formatted = history.messages.map((msg) => ({
              _id: msg._id,
              text: msg.text,
              createdAt: msg.createdAt,
              sender: msg.sender,
            }));
            setMessages(formatted);
          } else {
            console.log("No messages found or messages is not an array");
            setMessages([]);
          }
        } catch (err) {
          console.error("Failed to load chat history", err);
        } finally {
          setLoading(false);
        }
      })();

      socket.on("receive_message", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });

      return () => {
        socket.off("receive_message");
        disconnectSocket();
      };
    }, [chatId, user?._id])
  );

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(tabs)/chat");
    }
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const socket = getSocket();

    const messageData = {
      roomId: chatId,
      senderId: user?._id,
      message: inputMessage,
      messageType: "text",
    };

    socket.emit("send_message", messageData);
    setInputMessage("");
  };

  const renderMessage = ({ item }) => {
    const isCurrentUser = item.sender?._id === user?._id;

    return (
      <View className={`mb-4 mx-4 ${isCurrentUser ? "items-end" : "items-start"}`}>
        <View
          className={`max-w-[80%] p-4 rounded-xl ${isCurrentUser
            ? "bg-[#E86969] rounded-br-md"
            : "bg-white border border-gray-200 rounded-bl-md"
            }`}
        >
          <Text className={`text-base ${isCurrentUser ? "text-white" : "text-black"}`}>
            {item.text}
          </Text>
        </View>
        <Text className="text-gray-400 text-xs mt-1 mx-2">
          {new Date(item.createdAt).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white flex-1 items-center justify-center">
        <Text className="text-gray-500 text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-200">
        <TouchableOpacity onPress={handleBackPress}>
          <Feather name="arrow-left" size={24} color="black" />
        </TouchableOpacity>

        <View className="flex-row items-center gap-2 space-x-3">
          <View className="w-10 h-10 bg-[#E86969] rounded-full items-center justify-center">
            <Text className="text-white font-semibold text-lg">
              {userInitial || userName?.toString().charAt(0) || "U"}
            </Text>
          </View>
          <View>
            <Text className="text-black text-lg font-bold">
              {userName || "User"}
            </Text>
            <Text className="text-gray-400 text-sm">Online</Text>
          </View>
        </View>
        <View className="flex-row items-center space-x-4">
        </View>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 bg-[#E572721A]">
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={renderMessage}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingVertical: 16 }}
            inverted={false}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
          />
        </View>

        <View className="bg-white border-t border-gray-200 px-4 py-4">
          <View className="flex-row items-center gap-2">
            <TouchableOpacity className="border border-gray-200 rounded-full p-3">
              <Feather name="paperclip" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <View className="flex-1 border border-gray-200 rounded-full px-4 py-3">
              <TextInput
                value={inputMessage}
                onChangeText={setInputMessage}
                placeholder="Type a message..."
                placeholderTextColor="#9CA3AF"
                className="text-black text-base"
                multiline
              />
            </View>

            <TouchableOpacity
              onPress={handleSendMessage}
              className="bg-[#E86969] rounded-full p-3"
            >
              <Feather name="send" size={20} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}