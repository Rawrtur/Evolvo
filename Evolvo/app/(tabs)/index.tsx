import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import "@/global.css"
import { Text, View, Alert, Image, FlatList, ScrollView } from "react-native";
import { router } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import images from "@/constants/images";
import AddButton from "@/components/AddButton";
import LottieView from 'lottie-react-native';
import SecondButton from "@/components/SecondButton";
import { recommendedLectures, lectures } from "@/constants/data";


export default function App() {


  const { user } = useAuth();
  // useEffect(() => {

  //   if (!isLoggedIn) {
  //     router.replace("/(auth)/signin");
  //   }
  // }, [isLoggedIn])

  return (
    <SafeAreaView className="flex-1 items-center justify-center">
      <ScrollView className="h-full w-full bg-background p-5">
        <View className="home-header">
          <View className="home-user">
            <Image source={images.avatar} className="home-avatar" />
            <Text className="home-user-name"> {user?.name || "User" } </Text>
          </View>
          <AddButton onPress={() => { }} />
        </View>
        <View className="board flex-row justify-between">
          <View className="p-5 justify-between">
            <Text className="font-rubik text-white text-xl pb-5">Learn Rate</Text>
            <Text className="font-rubik-bold text-5xl text-white">73%</Text>
          </View>
          <LottieView
            source={require('../../assets/animations/thumbup.json')}
            autoPlay
            loop
            style={{ width: 200, height: 200 }}
          />
        </View>
        <View className="flex-row items-center justify-between pt-5">
          <Text className="font-rubik-semibold text-2xl">Recommended</Text>
          <SecondButton onPress={() => { }} title="View All" />
        </View>
        <FlatList
          data={recommendedLectures}
          horizontal
          className="h-[200px]"
          renderItem={(lecture) => (
            <View className="recommended m-3">

            </View>
          )}
        />
        <View className="flex-row items-center justify-between pt-5">
          <Text className="font-rubik-semibold text-2xl">All Lectures</Text>
          <SecondButton onPress={() => { }} title="View All" />
        </View>
        {lectures.map((lec, key) => (
          <View
            key={key}
          >
            <Text>{lec.title}</Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}