/* eslint-disable react-hooks/rules-of-hooks */
import { Text, View, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import LectureCard from '@/components/LectureCard'
import LottieView from 'lottie-react-native';
import ThemeTextInput from '@/components/ThemeTextInput'
import RoundedIconButton from '@/components/RoundedIconButton'


const lectures = () => {

  const { lectures, isLoading, questions } = useAuth();

  const [expandedLectureId, setExpandedLectureId] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  return (
    <View className='w-full h-full bg-background'>
      <SafeAreaView className='w-full h-full'>
        <ScrollView className='w-full h-full bg-background p-5'>
          <View className='flex-row items-center justify-between'>
            <RoundedIconButton
              onPress={() => router.back()}
              icon={icons.back}
            />
            <Text className='font-rubik-semibold text-2xl'>My Lectures</Text>
            <RoundedIconButton
              onPress={() => { }}
              icon={icons.menu}
            />
          </View>
          <View className='w-full'>
            <ThemeTextInput
              value={search}
              onChangeText={(setSearch)}
              placeholder='Search...'
              title=''
            />
          </View>
          <View>
            {isLoading && (
              <View className="w-full justify-center items-center h-full">
                <LottieView
                  source={require('../../assets/animations/loading.json')}
                  autoPlay
                  loop
                  style={{ width: 200, height: 200 }}
                />
              </View>
            )}
            {lectures.filter(lec => lec.title.toLowerCase().includes(search.toLowerCase())).map((lec) => {
              const currentQuestions = questions.filter(q => q.lecture === lec._id);
              return (
                <LectureCard
                  {...lec}
                  key={lec._id}
                  onPress={() => { setExpandedLectureId((currentId) => (currentId === lec._id ? null : lec._id)) }}
                  expanded={expandedLectureId === lec._id}
                  shortTermQuestions={currentQuestions.filter(q => q.state === "short").length}
                  mediumTermQuestions={currentQuestions.filter(q => q.state === "medium").length}
                  longTermQuestions={currentQuestions.filter(q => q.state === "long").length}
                  expandedDetails
                />
              )
            })}
          </View>
          <View className='h-40'/>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default lectures