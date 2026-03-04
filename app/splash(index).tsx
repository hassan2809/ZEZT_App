import { Image, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  return (
    <SafeAreaView className="bg-white h-full flex justify-center items-center px-8">
      <View className="flex-1 justify-center items-center">
        <View className="items-center mb-4">
          <Image
            source={require("../assets/images/project/logo.png")}
            className="w-[400px] h-[400px] mb-3"
            resizeMode="contain"
          />
        </View>
      </View>
      <View className="pb-12">
        <Text className="text-gray-600 text-base text-center">
          Last-minute restaurant deals near you
        </Text>
      </View>
    </SafeAreaView>
  );
}
