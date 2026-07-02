import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { flows, times } from '../../../constants/data';
import StudyOverview from '@/components/Overview';
import Button from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PreStudy from '@/components/PreStudy';

const OverView = () => {

  const { id, time } = useLocalSearchParams();
  const [index, setIndex] = React.useState(0);


  useEffect(() => {
    const setFlowIndex = async () => {
      const value = await AsyncStorage.getItem('flowIndex');
      if (value) {
        setIndex(Number(value));
      }
    }
    setFlowIndex();
  }, [])

  const flow = flows[time]
  const timeArray = times[time]


  const skipPreStudy = async () => {
    await AsyncStorage.removeItem('timerValue');
    await AsyncStorage.setItem('flowIndex', '2');
    setIndex(2)
  }

  const beginSession = async () => {
    await AsyncStorage.setItem('flowIndex', '1');
    setIndex(1)
  }

  const endSession = async () => {
    await AsyncStorage.removeItem('timerValue');
    await AsyncStorage.removeItem('flowIndex');
    router.replace('/(tabs)');
  }

  return (
    <ScrollView className="h-full bg-background p-5">
      {index === 0 && (
        <>
          <StudyOverview flow={flow} session={time} times={timeArray} />
          <Button title="Begin Session" onPress={beginSession} shadow fontStyle="font-rubik-bold text-white" />
          <View className="h-[60px]" />
        </>
      )}
      {index === 1 && (
        <>
          <PreStudy setIndex={setIndex} />
          <Button title="Skip" onPress={skipPreStudy} shadow fontStyle="font-rubik-bold text-white" />

        </>
      )}
      <View className="w-full items-center justify-center pt-10">
        <Button title="End Session" onPress={endSession} shadow />
      </View>
      <View className='h-[60px]' />
    </ScrollView>
  )
}

export default OverView