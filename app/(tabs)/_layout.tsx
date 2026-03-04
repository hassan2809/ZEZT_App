// @ts-nocheck
import { useAuthStore } from "@/src/stores/auth.store";
import { Feather, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { router, Tabs, usePathname } from "expo-router";
import { Text } from "react-native";

export default function TabLayout() {
  const pathname = usePathname();
  const isDetailScreen =
    pathname.includes("deal-detail") ||
    pathname.includes("confirm-booking") ||
    pathname.includes("booking-details");
  const isAccountScreen =
    pathname.includes("profile") || pathname.includes("settings");
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#E86969",
        tabBarInactiveTintColor: "#9CA3AF",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Feather
              name="home"
              size={22}
              color={isDetailScreen ? "#E86969" : color}
            />
          ),
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                fontSize: 12,
                fontWeight: "500",
                color: isDetailScreen ? "#E86969" : color,
              }}
            >
              Home
            </Text>
          ),
        }}
      />
      <Tabs.Screen
        name="bookings"
        options={{
          title: "Bookings",
          tabBarIcon: ({ color }) => (
            <Ionicons name="calendar-clear-outline" size={22} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              router.push("/(auth)/login");
            }
          },
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({ color }) => (
            <MaterialIcons name="messenger-outline" size={22} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              router.push("/(auth)/login");
            }
          },
        }}
      />
      {/* <Tabs.Screen
        name="rewards"
        options={{
          title: "Rewards",
          tabBarIcon: ({ color }) => (
            <Ionicons name="gift-outline" size={22} color={color} />
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              router.push("/(auth)/login");
            }
          },
        }}
      /> */}
      <Tabs.Screen
        name="account"
        options={{
          title: "Account",
          tabBarIcon: ({ color }) => (
            <Feather
              name="user"
              size={22}
              color={isAccountScreen ? "#E86969" : color}
            />
          ),
          tabBarLabel: ({ color }) => (
            <Text
              style={{
                fontSize: 12,
                fontWeight: "500",
                color: isAccountScreen ? "#E86969" : color,
              }}
            >
              Account
            </Text>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            if (!isLoggedIn) {
              e.preventDefault();
              router.push("/(auth)/login");
            }
          },
        }}
      />
      <Tabs.Screen
        name="(detail)"
        options={{
          href: null,
        }}
      />
      <Tabs.Screen
        name="(account)"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}
