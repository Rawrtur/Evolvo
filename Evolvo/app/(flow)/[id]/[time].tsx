import { View, Text, ScrollView } from 'react-native'
import React, { useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { flows, times } from '../../../constants/data';
import StudyOverview from '@/components/Overview';
import Button from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import PreStudy from '@/components/PreStudy';
import Focus from '@/components/Focus';
import Break from '@/components/Break';
import { useAuth } from '@/context/AuthContext';
import Review from '@/components/Review';

const OverView = () => {

  const { id, time } = useLocalSearchParams<{
    time: "30 min" | "60 min" | "90 min" | "120 min" | "150 min" | "180 min"
    id: string;
  }>();
  const [index, setIndex] = React.useState(0);
  const { setSessionState, commitLecture } = useAuth();

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
    setSessionState(true);
    setIndex(1)
  }

  const endSession = async () => {
    try {
      await AsyncStorage.removeItem('timerValue');
      await AsyncStorage.removeItem('flowIndex');
      setSessionState(false);

      if (index !== 0) await commitLecture(id);

      router.replace('/(tabs)');
    } catch (error) {
      console.error("Error while comitting Lecture: ", error)
    }

  }


  const currentTime = times[time][index - 1] || 0;
  const currentFlow = flows[time][index - 1] || '';
  // const currentFlow = "Review"
  // console.log('Current Time:', currentTime, 'Current Flow:', currentFlow, 'Index:', index);
  return (
    <ScrollView className="h-full bg-background p-5">
      {index === 0 && (
        <>
          <StudyOverview flow={flow} session={time} times={timeArray} />
          <Button title="Begin Session" onPress={beginSession} shadow fontStyle="font-rubik-bold text-white" />
          <View className="h-[60px]" />
        </>
      )}
      {currentFlow === "Pre Study Reset" && (
        <>
          <PreStudy setIndex={setIndex} />
          <Button title="Skip" onPress={skipPreStudy} shadow fontStyle="font-rubik-bold text-white" />

        </>
      )}
      {currentFlow === "Focus" && (
        <View>
          <Focus time={currentTime} index={index} setIndex={setIndex} />
        </View>
      )}
      {currentFlow === "Break" && (
        <View>
          <Break time={currentTime} index={index} setIndex={setIndex} />
        </View>
      )}
      {currentFlow === "Review" && (
        <Review id={id} />
      )}
      <View className="w-full items-center justify-center pt-10">
        <Button title={currentFlow === "Review" ? "Finish Session" : "End Session"} onPress={endSession} shadow style='w-[90%]' fontStyle='font-rubik-bold text-white' />
      </View>
      <View className='h-[60px]' />
    </ScrollView>
  )
}

export default OverView