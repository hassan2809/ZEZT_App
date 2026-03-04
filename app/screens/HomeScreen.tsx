// @ts-nocheck
import { useAuthStore } from "@/src/stores/auth.store";
import Feather from "@expo/vector-icons/Feather";
import Ionicons from "@expo/vector-icons/Ionicons";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import MapView, { Marker } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";
import { getAllDeals, getDealsWithFilters } from "../../src/services/deal.service";
import Slider from "@react-native-community/slider";
import { useForm, Controller } from "react-hook-form";
import { useLocationStore } from "@/src/stores/location.store";
import * as Location from "expo-location";
import Toast from "react-native-toast-message";
import { useFocusEffect } from "@react-navigation/native";
import ScreenHeader from "../components/ScreenHeader";

const { width, height } = Dimensions.get("window");

export default function HomeScreen() {
  const [isListView, setIsListView] = useState(true);
  const [deals, setDeals] = useState([]);
  const bottomSheetRef = useRef(null);
  const filterModalRef = useRef(null);
  const snapPoints = useMemo(() => ["25%", "75%"], []);
  const filterSnapPoints = useMemo(() => ["50%"], []);
  const router = useRouter();
  const mapRef = useRef(null);
  const user = useAuthStore((state) => state.user);
  const isLoggedIn = !!user;
  const [distance, setDistance] = useState(2);
  const [mapReady, setMapReady] = useState(false);
  const { control, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      cuisine: null,
      rating: null,
      distance: 5,
    },
  });
  const selectedCuisine = watch("cuisine");
  const selectedRating = watch("rating");
  const location = useLocationStore((state) => state.location);
  const setLocation = useLocationStore((state) => state.setLocation);
  const [loading, setLoading] = useState(true);

  const onApplyFilters = async (data) => {
    let coords = location;
    if (!coords) {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status === "granted") {
          let current = await Location.getCurrentPositionAsync({});
          coords = current.coords;
          await setLocation(coords);
        } else {
          console.log("Location permission denied");
        }
      } catch (err) {
        console.error("Error getting location:", err);
      }
    }
    const filtersWithLocation = {
      ...data,
      latitude: coords?.latitude || null,
      longitude: coords?.longitude || null,
    };

    const filterdeals = await getDealsWithFilters(filtersWithLocation);
    setDeals(filterdeals);
    filterModalRef.current?.dismiss();
    if (filterdeals && filterdeals.length > 0) {
      Toast.show({
        type: "success",
        text1: "Deals Found",
        text2: `${filterdeals.length} deals match your filters`,
      });
    } else {
      Toast.show({
        type: "info",
        text1: "No Deals",
        text2: "No deals found for selected filters",
      });
    }
  };

  const onResetFilters = () => {
    reset();
  };

  useFocusEffect(
    useCallback(() => {
      const fetchAllDeals = async () => {
        try {
          setLoading(true)
          const data = await getAllDeals();
          setDeals(data);
        } catch (err) {
          console.error("Error fetching deals:", err);
          setDeals([])
        } finally {
          setLoading(false)
        }
      };

      fetchAllDeals();
    }, [])
  );

  useEffect(() => {
    if (!isListView && deals.length > 0 && mapReady && mapRef.current) {
      const coords = deals
        .map((deal) => {
          const coordinates = deal.restaurant_id?.location?.coordinates;
          if (!coordinates || coordinates.length < 2) return null;
          const [lng, lat] = coordinates;
          return lat && lng && lat !== 0 && lng !== 0 
            ? { latitude: lat, longitude: lng } 
            : null;
        })
        .filter(Boolean);

      if (coords.length > 0) {
        mapRef.current.fitToCoordinates(coords, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    }
  }, [deals, isListView, mapReady]);

  const handleExpandBottomSheet = useCallback(() => {
    bottomSheetRef.current?.snapToIndex(0);
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log("handleSheetChanges", index);
  }, []);

  const handlePresentFilterModal = useCallback(() => {
    filterModalRef.current?.present();
  }, []);

  const handleFilterSheetChanges = useCallback((index) => {
    console.log("handleFilterSheetChanges", index);
  }, []);

  const renderDealCard = ({ item: deal }) => (
    <TouchableOpacity
      className="bg-white rounded-xl mb-4 mx-6 shadow-sm border border-gray-200"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => router.push(`/(tabs)/(detail)/deal-details/${deal._id}`)}
    >
      <View className="relative">
        <Image
          // source={{ uri: deal.image }}
          source={{
            uri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
          }}
          className="w-full h-48 rounded-t-xl"
          resizeMode="cover"
        />
        {deal.isAuraPicked && (
          <LinearGradient
            colors={["#9939E4", "#D6277D"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="absolute top-3 left-3 rounded-full overflow-hidden px-3 py-1 flex-row items-center"
          >
            <Ionicons name="star" size={12} color="white" />
            <Text className="text-white text-xs font-medium ml-1">
              Aura picked
            </Text>
          </LinearGradient>
        )}
      </View>
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <Text className="text-black text-xl font-bold">
            {deal.deal_title}
          </Text>
          <Text className="text-gray-500 bg-gray-100 ml-2 px-2 rounded-md text-sm">
            {deal.restaurant_id.cuisine[0]}
          </Text>
        </View>
        <Text className="text-gray-600 text-sm mb-3">
          {deal.deal_description}
        </Text>

        <View className="flex-row items-center mb-3">
          <View className="flex-row items-center mr-4">
            <Feather name="map-pin" size={14} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm ml-1">
              {/* {deal.distance} */}
              0.8 miles
            </Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="clock" size={14} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm ml-1">
              Ends at{" "}
              {new Date(
                new Date(deal.deal_start_date).getTime() +
                deal.deal_expires_in * 60 * 60 * 1000
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-[#E86969] text-xl font-bold">
              {deal.deal_price - deal.deal_discount}
            </Text>
            <Text className="text-gray-400 text-sm line-through ml-2">
              {deal.deal_price}
            </Text>
            <View className="bg-green-100 rounded px-2 py-1 ml-2">
              <Text className="text-green-600 text-xs font-semibold">
                {deal.deal_discount}
              </Text>
            </View>
          </View>
          <TouchableOpacity className="bg-[#E86969] rounded-lg px-4 py-2" onPress={() => router.push(`/deal-details/${deal._id}`)}>
            <Text className="text-white font-semibold">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderBottomSheetDealItem = ({ item: deal }) => (
    <TouchableOpacity
      className="bg-white rounded-xl mb-4 mx-2 shadow-sm border border-gray-200"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      onPress={() => router.push(`/(tabs)/(detail)/deal-details/${deal._id}`)}
    >
      <View className="relative">
        <Image
          // source={{ uri: deal.image }}
          source={{
            uri: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=400&h=300&fit=crop",
          }}
          className="w-full h-48 rounded-t-xl"
          resizeMode="cover"
        />
        {deal.isAuraPicked && (
          <LinearGradient
            colors={["#9939E4", "#D6277D"]}
            start={{ x: 0, y: 0.5 }}
            end={{ x: 1, y: 0.5 }}
            className="absolute top-3 left-3 rounded-full overflow-hidden px-3 py-1 flex-row items-center"
          >
            <Ionicons name="star" size={12} color="white" />
            <Text className="text-white text-xs font-medium ml-1">
              Aura picked
            </Text>
          </LinearGradient>
        )}
      </View>
      <View className="p-4">
        <View className="flex-row items-center mb-2">
          <Text className="text-black text-xl font-bold">
            {deal.deal_title}
          </Text>
          <Text className="text-gray-500 bg-gray-100 ml-2 px-2 rounded-md text-sm">
            {deal.restaurant_id.cuisine[0]}
          </Text>
        </View>
        <Text className="text-gray-600 text-sm mb-3">
          {deal.deal_description}
        </Text>

        <View className="flex-row items-center mb-3">
          <View className="flex-row items-center mr-4">
            <Feather name="map-pin" size={14} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm ml-1">
              {/* {deal.distance} */}
              0.8 miles
            </Text>
          </View>
          <View className="flex-row items-center">
            <Feather name="clock" size={14} color="#9CA3AF" />
            <Text className="text-gray-500 text-sm ml-1">
              Ends at{" "}
              {new Date(
                new Date(deal.deal_start_date).getTime() +
                deal.deal_expires_in * 60 * 60 * 1000
              ).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              })}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Text className="text-[#E86969] text-xl font-bold">
              {deal.deal_price - deal.deal_discount}
            </Text>
            <Text className="text-gray-400 text-sm line-through ml-2">
              {deal.deal_price}
            </Text>
            <View className="bg-green-100 rounded px-2 py-1 ml-2">
              <Text className="text-green-600 text-xs font-semibold">
                {deal.deal_discount}
              </Text>
            </View>
          </View>
          <TouchableOpacity className="bg-[#E86969] rounded-lg px-4 py-2" onPress={() => router.push(`/deal-details/${deal._id}`)}>
            <Text className="text-white font-semibold">Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  const MapViewHeader = () => (
    <View className="px-6 mb-4 flex-row items-center gap-2 space-x-3">
      <View className="flex-1 h-12 border border-gray-200 rounded-lg px-3 flex-row items-center">
        <Feather name="search" size={20} color="#9CA3AF" />
        <TextInput
          className="flex-1 pl-3 text-gray-600"
          placeholder="Search restaurants"
          placeholderTextColor="#9CA3AF"
        />
      </View>
      <TouchableOpacity
        className="h-12 w-12 bg-gray-50 border border-gray-200 rounded-lg items-center justify-center"
        onPress={handlePresentFilterModal}
      >
        <Feather name="sliders" size={20} color="#9CA3AF" />
      </TouchableOpacity>
    </View>
  );

  const ListHeaderComponent = () => (
    <>
      <View className="px-6 mb-4 flex-row items-center gap-2 space-x-3">
        <View className="flex-1 h-12 border border-gray-200 rounded-lg px-3 flex-row items-center">
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput
            className="flex-1 pl-3 text-gray-600"
            placeholder="Search restaurants"
            placeholderTextColor="#9CA3AF"
          />
        </View>
        <TouchableOpacity
          className="h-12 w-12 bg-gray-50 border border-gray-200 rounded-lg items-center justify-center"
          onPress={handlePresentFilterModal}
        >
          <Feather name="sliders" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      <View className="mx-6 mb-6">
        <LinearGradient
          colors={["#E57272", "#D9FFEC"]}
          start={{ x: -0.047, y: 0 }}
          end={{ x: 1.113, y: 1 }}
          className="rounded-xl overflow-hidden p-6 flex-row items-center"
        >
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold mb-1">
              Special Offer
            </Text>
            <Text className="text-white text-2xl font-bold mb-3">
              for March
            </Text>
            <Text className="text-white text-sm mb-4 opacity-90">
              We are here with the{"\n"}Best Burgers in town!
            </Text>
            <TouchableOpacity className="bg-white rounded-lg py-2 px-4 self-start">
              <Text className="text-[#E86969] font-semibold">Book Now</Text>
            </TouchableOpacity>
          </View>
          <View className="absolute -right-14 -bottom-16">
            <Image
              source={require("../../assets/images/project/heroSection.png")}
              className="w-80 h-72 rounded-lg"
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </View>
      <View className="px-6 mb-4">
        <View className="flex-row items-center">
          <Text className="text-black text-2xl font-bold">Hot Deals</Text>
          <Text className="text-2xl ml-2">🔥</Text>
        </View>
      </View>
      {loading && (
        <View className="px-6 py-8 items-center justify-center">
          <Text className="text-gray-500 text-base">Loading deals...</Text>
        </View>
      )}
    </>
  );

  const ListEmptyComponent = () => {
  if (loading) {
      return null; // Loading is shown in ListHeaderComponent
    }
    return (
      <View className="px-6 py-8 items-center justify-center">
        <Text className="text-gray-500 text-base">No deals available</Text>
      </View>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView className="bg-white flex-1" edges={["top"]}>
        <ScreenHeader title="Home" showAvatar />
        <View className="flex-row mx-6 mb-6">
          <TouchableOpacity
            className={`flex-1 py-3 rounded-l-lg border ${isListView
              ? "bg-[#E86969] border-[#E86969]"
              : "bg-gray-50 border-gray-200"
              }`}
            onPress={() => {
              setIsListView(true);
              bottomSheetRef.current?.close();
            }}
          >
            <View className="flex-row items-center justify-center">
              <Feather
                name="list"
                size={16}
                color={isListView ? "white" : "#9CA3AF"}
              />
              <Text
                className={`ml-2 font-medium ${isListView ? "text-white" : "text-gray-500"
                  }`}
              >
                List View
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 py-3 rounded-r-lg border ${!isListView
              ? "bg-[#E86969] border-[#E86969]"
              : "bg-gray-50 border-gray-200"
              }`}
            onPress={() => {
              setIsListView(false);
              setMapReady(false); 
              setTimeout(() => handleExpandBottomSheet(), 300);
            }}
          >
            <View className="flex-row items-center justify-center">
              <Feather
                name="map-pin"
                size={16}
                color={!isListView ? "white" : "#9CA3AF"}
              />
              <Text
                className={`ml-2 font-medium ${!isListView ? "text-white" : "text-gray-500"
                  }`}
              >
                Map View
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        {isListView ? (
          <FlatList
            data={deals}
            renderItem={renderDealCard}
            keyExtractor={(item) => item._id.toString()}
            ListHeaderComponent={ListHeaderComponent}
            ListEmptyComponent={ListEmptyComponent}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1">
            <MapViewHeader />
            <View className="flex-1 relative">
              <MapView
                style={{ flex: 1 }}
                ref={mapRef}
                showsUserLocation={true}
                showsMyLocationButton={true}
                onMapReady={() => setMapReady(true)}
              >
                {deals.map((deal) => (
                  <Marker
                    key={deal._id}
                    coordinate={{
                      latitude: deal.restaurant_id.location.coordinates[1],
                      longitude: deal.restaurant_id.location.coordinates[0],
                    }}
                    title={deal.deal_title}
                    description={deal.deal_description}
                    onPress={handleExpandBottomSheet}
                  >
                    <View className="bg-[#E86969] rounded-full w-8 h-8 items-center justify-center border-2 border-white">
                      <Text className="text-white text-xs font-bold">
                        {deal._id}
                      </Text>
                    </View>
                  </Marker>
                ))}
              </MapView>
            </View>
          </View>
        )}
        {!isListView && (
          <BottomSheet
            ref={bottomSheetRef}
            index={0}
            snapPoints={snapPoints}
            onChange={handleSheetChanges}
            enableDynamicSizing={false}
            backgroundStyle={{ backgroundColor: "white" }}
            handleIndicatorStyle={{ backgroundColor: "#D1D5DB" }}
            enableDismissOnClose={false}
            enablePanDownToClose={false}
          >
            <View className="flex-1 px-2">
              <View className="pb-4">
                <Text className="text-black text-lg font-bold text-center">
                  {deals.length.toLocaleString()} results
                </Text>
              </View>
              <BottomSheetFlatList
                data={deals}
                keyExtractor={(item) => item._id.toString()}
                renderItem={renderBottomSheetDealItem}
                contentContainerStyle={{ paddingBottom: 20 }}
                showsVerticalScrollIndicator={false}
              />
            </View>
          </BottomSheet>
        )}
        <BottomSheetModal
          ref={filterModalRef}
          index={0}
          snapPoints={filterSnapPoints}
          enableDynamicSizing={false}
          onChange={handleFilterSheetChanges}
          backgroundStyle={{ backgroundColor: "white" }}
          handleIndicatorStyle={{ backgroundColor: "#D1D5DB" }}
        >
          <BottomSheetView style={{ flex: 1, padding: 16 }}>
            <Text className="text-black text-xl text-center font-bold mb-4">
              Filters
            </Text>
            <View className="mb-6">
              <Text className="text-black text-lg font-semibold mb-3">
                Cuisine Type
              </Text>
              <Controller
                control={control}
                name="cuisine"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row flex-wrap gap-2">
                    {["Italian", "Middle Eastern", "American", "Indian", "Chinese"].map(
                      (cuisine) => (
                        <TouchableOpacity
                          key={cuisine}
                          className={`rounded-lg px-4 py-2 ${value === cuisine
                            ? "bg-[#E86969]"
                            : "bg-gray-100"
                            }`}
                          onPress={() => onChange(cuisine)}
                        >
                          <Text
                            className={`font-medium ${value === cuisine ? "text-white" : "text-gray-700"
                              }`}
                          >
                            {cuisine}
                          </Text>
                        </TouchableOpacity>
                      )
                    )}
                  </View>
                )}
              />
            </View>
            <View className="mb-6">
              <Text className="text-black text-lg font-semibold mb-3">
                Minimum Rating
              </Text>
              <Controller
                control={control}
                name="rating"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row gap-2">
                    {[3, 4, 4.5].map((rating) => (
                      <TouchableOpacity
                        key={rating}
                        className={`rounded-full px-3 py-2 flex-row items-center ${value === rating ? "bg-[#E86969]" : "bg-gray-100"
                          }`}
                        onPress={() => onChange(rating)}
                      >
                        <Text
                          className={`font-medium ${value === rating ? "text-white" : "text-gray-700"
                            }`}
                        >
                          {rating}+
                        </Text>
                        <Text
                          className={`ml-1 ${value === rating ? "text-yellow-300" : "text-yellow-500"
                            }`}
                        >
                          ⭐
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              />
            </View>
            <View className="mb-6">
              <Controller
                control={control}
                name="distance"
                render={({ field: { onChange, value } }) => (
                  <>
                    <Text className="text-black text-lg font-semibold">
                      Distance: {value} KM
                    </Text>
                    <Slider
                      style={{ height: 40, marginBottom: 10 }}
                      minimumValue={1}
                      maximumValue={20}
                      step={1}
                      minimumTrackTintColor="#E86969"
                      maximumTrackTintColor="#ccc"
                      thumbTintColor="#E86969"
                      value={value}
                      onValueChange={onChange}
                    />
                  </>
                )}
              />
            </View>
            <View className="flex-row justify-between mt-auto mb-4">
              <TouchableOpacity
                className="flex-1 bg-gray-200 rounded-lg py-3 mr-2"
                onPress={onResetFilters}
              >
                <Text className="text-gray-700 font-semibold text-center">
                  Reset
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-[#E86969] rounded-lg py-3 ml-2"
                onPress={handleSubmit(onApplyFilters)}
              >
                <Text className="text-white font-semibold text-center">
                  Apply Filters
                </Text>
              </TouchableOpacity>
            </View>
          </BottomSheetView>
        </BottomSheetModal>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
}
