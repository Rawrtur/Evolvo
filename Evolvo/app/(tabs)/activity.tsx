/* eslint-disable react-hooks/rules-of-hooks */
import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import RoundedIconButton from '@/components/RoundedIconButton'
import { router } from 'expo-router'
import { icons } from '@/constants/icons'
import { PieChart } from "react-native-chart-kit";
import { useAuth } from '@/context/AuthContext'
import LectureCard from '@/components/LectureCard'
import LottieView from 'lottie-react-native';


const states = [
  { state: "short", color: "#238200" },
  { state: "medium", color: "#dfcd00" },
  { state: "long", color: "#b80000" },
  { state: "none", color: "#3e3e3e" }
]

const activity = () => {

  const { questions, lectures, isLoading } = useAuth();
  const history = lectures
    .filter((l) => l.lastLecture)
    .sort(
      (a, b) => new Date(b.lastLecture) - new Date (a.lastLecture)
    );

  const pieData = states.map(s => ({
    name: s.state,
    population: questions.filter(q => q.state === s.state).length,
    color: s.color,
  }))

  const [expandedLectureId, setExpandedLectureId] = React.useState<string | null>(null);


  return (
    <View className='w-full h-full bg-background'>
      <SafeAreaView className='w-full h-full'>
        <ScrollView className='w-full h-full bg-background p-5'>
          <View className='flex-row items-center justify-between'>
            <RoundedIconButton
              onPress={() => router.back()}
              icon={icons.back}
            />
            <Text className='font-rubik-semibold text-2xl'>Monthly Insights</Text>
            <View className='w-9'></View>
          </View>

          <View className='bg-white border border-accent mt-10 p-5 rounded-xl items-center justify-center'>
            <Text className='text-center font-rubik-bold text-xl'>Question-pie</Text>
            <View className="items-center">
              {!isLoading && <PieChart
                data={pieData}
                width={220}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                }}
                hasLegend={false}
                accessor={"population"}
                backgroundColor={"transparent"}
                paddingLeft={"50"}
                style={{ alignSelf: "center" }}
              />}
            </View>

            {isLoading ? (
              <View className='w-full items-center justify-center'>
                <LottieView
                  source={require('../../assets/animations/loading.json')}
                  autoPlay
                  loop
                  style={{ width: 340, height: 340 }}
                />
              </View>
            ) : (
              <View className="w-[90%] overflow-hidden">
                {states.map((st, key) => (
                  <View key={key} className="flex-row items-center">
                    <View className="h-6 w-6 rounded-full" style={{ backgroundColor: st.color }} />
                    <Text className="flex-1 p-3 font-bold">{st.state}</Text>
                    <Text className="flex-1 p-3 font-bold">{questions.filter(q => q.state === st.state).length}</Text>
                    <Text className="flex-1 p-3 font-bold">{(questions.filter(q => q.state === st.state).length / questions.length * 100).toFixed(0)}%</Text>
                  </View>
                ))}
                <View className="flex-row items-center border-t border-accent">
                  <View className="h-6 w-6 rounded-full" />
                  <Text className="flex-1 p-3 font-bold">Sum: </Text>
                  <Text className="flex-1 p-3 font-bold">{questions.length}</Text>
                  <Text className="flex-1 p-3 font-bold"></Text>
                </View>
              </View>)}
          </View>
          <View className='flex-row items-center justify-between py-5'>
            <Text className='font-rubik-semibold text-2xl'>History</Text>
            <View />
          </View>
          {history.slice(0, 3).map((lec, key) => {
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
          <View className='h-40' />
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default activity