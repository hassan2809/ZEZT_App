// @ts-nocheck
import Feather from "@expo/vector-icons/Feather";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ScreenHeader from "../components/ScreenHeader";

export default function RewardsScreen() {
  const router = useRouter();

  const userData = {
    name: "James David",
    loyaltyPoints: 2140,
    pointsTillNextReward: 160,
    level: "Lvl 2",
    referralCode: "HLA8G4B9ZX4",
  };

  const availableRewards = [
    {
      id: 1,
      title: "Free Appetizer",
      points: 50,
    },
    {
      id: 2,
      title: "$5 Off Dinner",
      points: 100,
    },
    {
      id: 3,
      title: "Free Dessert",
      points: 75,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      action: "Earned 25 points",
      description: "Bella Vista Italian booking",
      time: "2 hours ago",
    },
  ];

  const handleBackPress = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.push("/(auth)/login");
    }
  };

  const handleCopyReferralCode = () => {
    console.log("Copied referral code:", userData.referralCode);
  };

  return (
    <SafeAreaView className="bg-white">
      <ScreenHeader title="Rewards & Referals" showAvatar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="mx-4">
          <LinearGradient
            colors={["#E57272", "rgba(229, 114, 114, 0.4)"]}
            start={{ x: 0.15, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="rounded-xl p-6 relative overflow-hidden"
          >
            <View className="absolute -right-4 -top-4 w-20 h-20 bg-white opacity-10 rounded-full" />
            <View className="absolute -right-8 top-12 w-16 h-16 bg-white opacity-10 rounded-full" />

            <View className="flex-row justify-between gap-4">
              <View className="my-auto">
                <FontAwesome5 name="coins" size={64} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-white text-lg opacity-90 mb-2">
                  Loyalty points
                </Text>
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-white text-2xl font-bold">
                    {userData.loyaltyPoints} Pts
                  </Text>
                  <Text className="text-white text-md font-medium">
                    {userData.level}
                  </Text>
                </View>
                <View className="flex-row items-center mb-2">
                  <View className="flex-1 bg-white bg-opacity-30 rounded-full h-2">
                    <View
                      className="bg-white rounded-full h-2"
                      style={{ width: "75%" }}
                    />
                  </View>
                </View>
                <Text className="text-white text-sm opacity-90 mb-4">
                  {userData.pointsTillNextReward} points till your next reward
                </Text>

                <Text className="text-white text-xl font-medium">
                  {userData.name}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
        <View className="mx-4 my-6">
          <Text className="text-black text-2xl font-bold mb-4">
            Available Rewards
          </Text>
          {availableRewards.map((reward) => (
            <View
              key={reward.id}
              className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl p-4 mb-3"
            >
              <View>
                <Text className="text-black text-lg font-bold mb-1">
                  {reward.title}
                </Text>
                <Text className="text-[#E86969] text-sm font-medium">
                  {reward.points} points
                </Text>
              </View>
              <TouchableOpacity className="bg-[#E86969] rounded-lg px-6 py-2">
                <Text className="text-white font-semibold">Redeem</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
        <View className="mx-4 mb-6">
          <Text className="text-black text-2xl font-bold mb-4">
            Invite Friends & Earn
          </Text>
          <View className="flex-row items-center gap-2 w-full">
            <View className="flex-1 border border-gray-200 rounded-lg px-4 py-3">
              <Text className="text-black font-mono text-sm">
                {userData.referralCode}
              </Text>
            </View>
            <TouchableOpacity className="border border-gray-200 rounded-lg px-4 py-3">
              <Feather name="copy" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>
        </View>
        <View className="mx-4 mb-8">
          <Text className="text-black text-2xl font-bold mb-4">
            Recent Activity
          </Text>
          {recentActivity.map((activity) => (
            <View
              key={activity.id}
              className="flex-row items-center justify-between bg-white border border-gray-200 rounded-xl p-4"
            >
              <View className="flex-1">
                <Text className="text-black text-base font-bold mb-1">
                  {activity.action}
                </Text>
                <Text className="text-gray-500 text-sm">
                  {activity.description}
                </Text>
              </View>
              <Text className="text-gray-400 text-sm">{activity.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
