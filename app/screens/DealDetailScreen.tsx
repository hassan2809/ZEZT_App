// @ts-nocheck
import { getSingleDeal } from "@/src/services/deal.service";
import { useAuthStore } from "@/src/stores/auth.store";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  BackHandler,
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ScreenHeader from "../components/ScreenHeader";

const { width, height } = Dimensions.get("window");

export default function DealDetailScreen() {
  const { dealId } = useLocalSearchParams();
  const [deal, setDeal] = useState(null);
  const [mapReady, setMapReady] = useState(false);
  const mapRef = useRef(null);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSingleDeal = async () => {
      try {
        setLoading(true);
        const data = await getSingleDeal(dealId);
        setDeal(data);
      } catch (err) {
        console.log(err.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchSingleDeal();
  }, []);

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        router.replace("/(tabs)");
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress
      );

      return () => subscription?.remove();
    }, [router])
  );

  useEffect(() => {
    if (deal && mapReady && mapRef.current && deal.latitude && deal.longitude) {
      mapRef.current.animateToRegion({
        latitude: deal.latitude,
        longitude: deal.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [deal, mapReady]);

  useEffect(() => {
    if (activeTab === "Info" && deal && mapReady && mapRef.current && deal.latitude && deal.longitude) {
      mapRef.current.animateToRegion({
        latitude: deal.latitude,
        longitude: deal.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    }
  }, [activeTab, deal, mapReady]);

  const handleBookingPress = () => {
    if (user) {
      router.push({
        pathname: "/(tabs)/(detail)/confirm-booking",
        params: { dealId },
      });
    } else {
      router.push("/(auth)/login");
      Toast.show({
        type: "error",
        text1: "Login Required",
        text2: "You must be logged in to book a deal.",
      });
    }
  };

  const restaurant = {
    id: 1,
    name: "Bella Vista Italian",
    cuisine: "Italian",
    description: "Early Bird Special: 3-Course Italian Dinner",
    distance: "0.3 miles",
    time: "Ends at 6PM",
    price: "$60",
    originalPrice: "$90",
    discount: "25% OFF",
    image:
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
    isAuraPicked: true,
    latitude: 37.78825,
    longitude: -122.4324,
    address: "123 Main St, Downtown",
    hours: "Mon-Sun: 11:00 AM - 10:00 PM",
    expiresIn: "14:38",
  };

  const [activeTab, setActiveTab] = useState("Info");

  const renderTabContent = () => {
    switch (activeTab) {
      case "Info":
        return (
          <View>
            <View className="mb-6">
              <Text className="text-black text-xl font-bold">Location</Text>
              <Text className="text-gray-400 text-md mb-4">
                {restaurant.address}
              </Text>
              <View className="h-48 rounded-xl overflow-hidden">
                <MapView
                  style={{ flex: 1 }}
                  ref={mapRef}
                  scrollEnabled={false}
                  zoomEnabled={false}
                  onMapReady={() => setMapReady(true)}
                >
                  {deal && (
                    <Marker
                      coordinate={{
                        latitude: deal.latitude,
                        longitude: deal.longitude,
                      }}
                      title={deal.name}
                    >
                      <View className="bg-[#E86969] rounded-full w-8 h-8 items-center justify-center border-2 border-white">
                        <Text className="text-white text-xs font-bold">1</Text>
                      </View>
                    </Marker>
                  )}
                </MapView>
              </View>
            </View>
            <View className="mb-6">
              <Text className="text-black text-xl font-bold">Hours</Text>
              <Text className="text-gray-500">{restaurant.hours}</Text>
            </View>
          </View>
        );
      case "Menu":
        return (
          <View>
            <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <Text className="text-black text-xl font-bold mb-1">
                Signature Pasta
              </Text>
              <Text className="text-gray-500 text-sm mb-2">
                Fresh handmade pasta with seasonal ingredients
              </Text>
              <Text className="text-[#E86969] text-xl font-bold">$18-24</Text>
            </View>
            <View className="bg-white rounded-xl p-4 mb-4 border border-gray-200">
              <Text className="text-black text-xl font-bold mb-1">
                Wood-fired Pizza
              </Text>
              <Text className="text-gray-500 text-sm mb-2">
                Authentic Neapolitan style pizza
              </Text>
              <Text className="text-[#E86969] text-xl font-bold">$16-22</Text>
            </View>
          </View>
        );

      case "Reviews":
        return (
          <View>
            <View className="flex-row mb-4 border border-gray-200 rounded-xl p-2">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
                }}
                className="w-12 h-12 rounded-full mr-3"
              />
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row gap-2 justify-center items-center">
                    <Text className="text-black text-xl font-bold">Ava</Text>
                    <View className="flex-row mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Text key={star} className="text-red-500 text-sm">
                          ⭐
                        </Text>
                      ))}
                    </View>
                  </View>
                  <Text className="text-gray-400 text-sm">Sept 2 2024</Text>
                </View>
                <Text className="text-gray-600 text-sm">
                  Amazing food and great service! The AI recommendation was spot
                  on.
                </Text>
              </View>
            </View>
            <View className="flex-row mb-4 border border-gray-200 rounded-xl p-2">
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
                }}
                className="w-12 h-12 rounded-full mr-3"
              />
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <View className="flex-row gap-2 justify-center items-center">
                    <Text className="text-black text-xl font-bold">Ava</Text>
                    <View className="flex-row mb-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Text key={star} className="text-red-500 text-sm">
                          ⭐
                        </Text>
                      ))}
                    </View>
                  </View>
                  <Text className="text-gray-400 text-sm">Sept 2 2024</Text>
                </View>
                <Text className="text-gray-600 text-sm">
                  Amazing food and great service! The AI recommendation was spot
                  on.
                </Text>
              </View>
            </View>
          </View>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="bg-white flex-1 items-center justify-center">
        <Text className="text-gray-500 text-lg">Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="bg-white flex-1" edges={["top"]}>
      <ScreenHeader title="Home" showBack showAvatar/>
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="relative px-4">
          <Image
            source={{ uri: restaurant.image }}
            className="w-full h-64 rounded-xl"
            resizeMode="cover"
          />
          {restaurant.isAuraPicked && (
            <LinearGradient
              colors={["#9939E4", "#D6277D"]}
              start={{ x: 0, y: 0.5 }}
              end={{ x: 1, y: 0.5 }}
              className="absolute top-4 left-8 rounded-full overflow-hidden px-3 py-1 flex-row items-center"
            >
              <Ionicons name="star" size={12} color="white" />
              <Text className="text-white text-xs font-medium ml-1">
                Aura picked
              </Text>
            </LinearGradient>
          )}
        </View>
        <View className="px-4 py-4">
          <Text className="text-black text-2xl font-bold mb-2">
            {deal?.deal_title}
          </Text>
          <Text className="text-gray-600 text-base mb-4">
            {deal?.description}
          </Text>
          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center mr-6">
              <Feather name="map-pin" size={16} color="#9CA3AF" />
              <Text className="text-gray-500 ml-2">{deal?.distance}</Text>
            </View>
            <View className="flex-row items-center">
              <Feather name="clock" size={16} color="#9CA3AF" />
              <Text className="text-gray-500 ml-2">{deal?.time}</Text>
            </View>
          </View>
          <LinearGradient
            colors={["#9939E4", "#D6277D"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="rounded-xl overflow-hidden p-4 mb-4 flex-row items-center"
          >
            <Ionicons name="star" size={20} color="white" />
            <View className="flex-1 ml-3">
              <Text className="text-white font-bold text-base">
                Recommended Booking: 5:00 PM - 25% OFF
              </Text>
              <Text className="text-white text-sm opacity-90">
                Low traffic hour special!
              </Text>
            </View>
          </LinearGradient>
          <View className="flex-col p-4 rounded-xl overflow-hidden bg-[#E572721A] mb-6">
            <View className="flex-row items-center">
              <Text className="text-[#E86969] text-3xl font-bold">
                {deal?.price}
              </Text>
              <Text className="text-gray-400 text-lg line-through ml-3">
                {deal?.originalPrice}
              </Text>
              <View className="bg-green-100 rounded-full px-3 py-1 ml-3">
                <Text className="text-green-600 text-sm font-semibold">
                  {deal?.discount}
                </Text>
              </View>
            </View>
            <View className="flex-row items-center">
              <Feather name="clock" size={16} color="#E86969" />
              <Text className="text-[#E86969] ml-2 font-medium">
                Deal expires in {deal?.expiresIn}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            className="bg-[#E86969] rounded-xl py-4 mb-6"
            onPress={handleBookingPress
            }
          >
            <Text className="text-white text-center font-bold text-lg">
              Book Now
            </Text>
          </TouchableOpacity>
          <View className="flex-row bg-white border border-gray-200 rounded-xl p-1 mb-6">
            {["Info", "Menu", "Reviews"].map((tab) => (
              <TouchableOpacity
                key={tab}
                className={`flex-1 py-3 rounded-lg ${activeTab === tab ? "bg-gray-100" : ""
                  }`}
                onPress={() => {
                  setActiveTab(tab);
                  if (tab === "Info") {
                    setMapReady(false);
                  }
                }}
              >
                <Text
                  className={`text-center font-medium ${activeTab === tab ? "text-black" : "text-gray-500"
                    }`}
                >
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {renderTabContent()}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
