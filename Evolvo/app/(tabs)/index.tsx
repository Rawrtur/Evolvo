import { useAuth } from "@/context/AuthContext";
import "@/global.css"
import { Text, View, Image, FlatList, ScrollView } from "react-native";
import { router } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import images from "@/constants/images";
import AddButton from "@/components/AddButton";
import LottieView from 'lottie-react-native';
import SecondButton from "@/components/SecondButton";
import { recommendedLectures } from "@/constants/data";
import RecommendedLecture from "@/components/RecommendedLecture";
import LectureCard from "@/components/LectureCard";



export default function App() {

  const [expandedLectureId, setExpandedLectureId] = useState<string | null>(null);

  const { user, isLoading, isLoggedIn, lectures, questions } = useAuth();
  useEffect(() => {

    if (!isLoggedIn && !isLoading) {
      router.replace("/(auth)/signin");
      return;
    }
  }, [isLoggedIn, isLoading])


  if (isLoading) return (
    <View className="w-full h-full items-center justify-center">
      <LottieView
        source={require('../../assets/animations/loading.json')}
        autoPlay
        loop
        style={{ width: 200, height: 200 }}
      />
    </View>
  )

  return (
    <View className='w-full h-full bg-background'>

      <SafeAreaView className="flex-1 items-center justify-center">
        <ScrollView className="h-full w-full bg-background p-5">
          <View className="home-header">
            <View className="home-user">
              <Image source={images.avatar} className="home-avatar" />
              <Text className="home-user-name"> {user?.name || "User"} </Text>
            </View>
            <AddButton onPress={() => router.navigate("/(sites)/createLecture")} />
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
          <View className="flex-row items-center justify-between py-5">
            <Text className="font-rubik-semibold text-2xl">Recommended</Text>
            <SecondButton onPress={() => { }} title="View All" />
          </View>

          <FlatList
            data={lectures}
            className="w-full"
            renderItem={({ item }) => (
              <RecommendedLecture data={item} />
            )}
            keyExtractor={(item) => item._id}
            horizontal
            showsHorizontalScrollIndicator={false}
            ListEmptyComponent={
              <View className="w-full items-center justify-center">
                <View className="relative h-30 w-full flex-row items-center overflow-visible rounded-2xl border border-gray-200 bg-white px-4">
                  <View className="absolute -left-5">
                    <LottieView
                      source={require('../../assets/animations/sleep.json')}
                      autoPlay
                      loop
                      style={{ width: 140, height: 140 }}
                    />
                  </View>

                  <View className="ml-24 flex-1">
                    <Text className="font-rubik-bold text-base text-gray-800">
                      No Recommended Lectures
                    </Text>
                    <Text className="mt-1 font-rubik text-sm text-gray-500">
                      Complete more lectures to receive{`\n`}personalized recommendations.
                    </Text>
                  </View>
                </View>
              </View>
            }
          />

          <View className="flex-row items-center justify-between py-5">
            <Text className="font-rubik-semibold text-2xl">All Lectures</Text>
            <SecondButton onPress={() => router.navigate("/(tabs)/lectures")} title="View All" />
          </View>
          {lectures.map((lec, key) => {
            const currentQuestions = questions.filter(q => q.lecture === lec._id);
            return (
              <LectureCard
                key={key}
                {...lec}
                onPress={() => { setExpandedLectureId((currentId) => (currentId === lec._id ? null : lec._id)) }}
                expanded={expandedLectureId === lec._id}
                shortTermQuestions={currentQuestions.filter(q => q.state === "short").length}
                mediumTermQuestions={currentQuestions.filter(q => q.state === "medium").length}
                longTermQuestions={currentQuestions.filter(q => q.state === "long").length}
              />
            )
          })}
          {lectures.length === 0 ? (
            <View className="w-full items-center justify-center">
              <View className="relative h-30 w-full flex-row items-center overflow-visible rounded-2xl border border-gray-200 bg-white px-4">
                <View className="absolute -left-5">
                  <LottieView
                    source={require('../../assets/animations/sleep.json')}
                    autoPlay
                    loop
                    style={{ width: 140, height: 140 }}
                  />
                </View>

                <View className="ml-24 flex-1">
                  <Text className="font-rubik-bold text-base text-gray-800">
                    No Lectures created
                  </Text>
                  <Text className="mt-1 font-rubik text-sm text-gray-500">
                    Create more lectures to show them.
                  </Text>
                </View>
              </View>
            </View>
          ) : (<View className="w-full items-center justify-center h-[200px]">
            <LottieView
              source={require('../../assets/animations/thumbup.json')}
              autoPlay
              loop
              style={{ width: 300, height: 300 }}
            />
          </View>)
          }
          <View className="h-30" />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}