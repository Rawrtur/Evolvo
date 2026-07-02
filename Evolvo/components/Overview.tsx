import React from 'react'
import { View, Text } from 'react-native'
import RoundedIconButton from './RoundedIconButton'
import { icons } from '@/constants/icons'
import { router } from 'expo-router';


const subtitles = {
    "Pre Study Reset": "Clear your Space",
    "Focus": "Work until the next break",
    "Break": "step away from your desk",
    "Review": "Review your work and questions",
}

function StudyOverview({ flow, session, times }: { flow: string[], session: string | string[], times: number[] }) {

    const calculateFocusTime = () => {
        let totalFocusTime = 0;
        flow.forEach((f, i) => {
            if (f === "Focus") {
                totalFocusTime += times[i];
            }
        });
        return totalFocusTime;
    }

    return (
        <View className="pb-10">
            <View className='flex-row pt-5 items-center gap-5'>
                <RoundedIconButton
                    onPress={() => router.back()}
                    icon={icons.back}
                />
                <Text className='font-rubik'>Change Duration</Text>
            </View>
            <View>
                <Text className="font-rubik-bold text-2xl pt-5">Your Study Plan</Text>
                <Text className="font-rubik">{session} Session</Text>
            </View>
            <View className="p-5 items-between w-full justify-center flex-row gap-5">
                <View className="border border-accent rounded-xl items-center p-3 w-[33%] bg-white">
                    <Text className="font-rubik-bold text-2xl">{flow.length}</Text>
                    <Text className="font-rubik-light text-center">blocks</Text>
                </View>
                <View className="border border-accent rounded-xl items-center p-3 w-[33%] bg-white">
                    <Text className="font-rubik-bold text-2xl">{calculateFocusTime()}</Text>
                    <Text className="font-rubik-light text-center">focus mins</Text>
                </View>
                <View className="border border-accent rounded-xl items-center p-3 w-[33%] bg-white">
                    <Text className="font-rubik-bold text-2xl">{flow.filter(f => f === "Break").length}</Text>
                    <Text className="font-rubik-light text-center">breaks</Text>
                </View>
            </View>
            <View className="mt-5 border border-accent rounded-xl px-5 pb-5 bg-white">
                {flow.map((f, i) => (
                    <View key={i} className="flex-row items-center w-full">
                        <Text className="font-rubik-semibold text-xl">{i + 1}</Text>
                        <View className="flex-row items-center justify-between flex-1 py-2 ml-5 border-b border-accent">
                            <View>
                            <Text className="font-rubik-semibold">{f}</Text>
                            <Text className="font-rubik-light">{subtitles[f] || ""}</Text>
                            </View>
                            <Text className="font-rubik-semibold">{times[i]} mins</Text>
                        </View>
                    </View>
                ))}
            </View>
        </View>
    )
}

export default StudyOverview
