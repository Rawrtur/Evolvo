import { useAuth } from "@/context/AuthContext";
import "@/global.css"
import { Text, View, FlatList, ScrollView, TouchableOpacity } from "react-native";
import { router } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import AddButton from "@/components/AddButton";
import LottieView from 'lottie-react-native';
import SecondButton from "@/components/SecondButton";
import RecommendedLecture from "@/components/RecommendedLecture";
import LectureCard from "@/components/LectureCard";
import LoadingScreen from "@/components/LoadingScreen";
import { recommendedLectures } from "@/utils/recommendedLectures";
import { progress } from "@/utils/progress";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";



export default function App() {

  const [expandedLectureId, setExpandedLectureId] = useState<string | null>(null);

  const { user, isLoading, isLoggedIn, lectures, questions, isInSession, sessionState } = useAuth();
  useEffect(() => {

    if (!isLoggedIn && !isLoading) {
      router.replace("/(auth)/signin");
      return;
    }
  }, [isLoggedIn, isLoading])

  const [inSession, setInSession] = useState(false);
  const [currenSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState<string | null>(null);

  useEffect(() => {
    const checkSessionState = async () => {
      const session = await isInSession() || sessionState;
      setInSession(session);
      const sessionId = await AsyncStorage.getItem("sessionId");
      setCurrentSessionId(sessionId);
      const time = await AsyncStorage.getItem("time");
      setCurrentTime(time);
    }
    checkSessionState()
  }, [sessionState])


  if (isLoading) return <LoadingScreen />

  const n = (lectures.length + (lectures.length % 2 === 0 ? 0 : 1)) / 2;
  const recommended = recommendedLectures(lectures).slice(0, n);

  const streak = user?.streak || 0;

  const lastStreakDate = new Date(user.lastStreakDate);
  const today = new Date();
  const diffTime = Math.abs(today - lastStreakDate);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays > 1 && streak > 0) {
    user.streak = 0;
  }


  return (
    <View className='w-full h-full bg-background relative'>
      <SafeAreaView className="flex-1 items-center justify-center">
        <ScrollView className="h-full w-full bg-background p-5">
          <View className="home-header">
            <View className="home-user">
              <Text className="home-user-name"><Text className="font-rubik-bold text-accent">{streak}</Text>🔥 {user?.name || "User"} </Text>
            </View>
            <AddButton onPress={() => router.navigate("/(sites)/createLecture")} />
          </View>
          <View className="board flex-row justify-between">
            <View className="p-5 justify-between">
              <Text className="font-rubik text-white text-xl pb-5">Learn Rate</Text>
              <Text className="font-rubik-bold text-5xl text-white">{progress(questions).toFixed(0)}%</Text>
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
            <SecondButton onPress={() => router.navigate("/(sites)/recommended")} title="View All" />
          </View>

          <FlatList
            data={recommended}
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
      {inSession && (
        <TouchableOpacity
          className="absolute border border-accent flex-row bg-white rounded-xl px-3 py-1 shadow-lg items-center justify-center"
          style={{ right: 10, top: 150 }}
          onPress={() => router.navigate(`/(flow)/${currenSessionId}/${currentTime}`)}
        >
          <Text className="font-rubik text-center"> Navigate to Session</Text>
          <Ionicons name="arrow-forward-circle" color={colors.accent} size={40} />
        </TouchableOpacity>
      )}

    </View>
  );
}