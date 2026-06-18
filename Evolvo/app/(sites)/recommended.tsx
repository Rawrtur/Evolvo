/* eslint-disable react-hooks/rules-of-hooks */
import { View, Text, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { recommendedLectures } from '@/utils/recommendedLectures';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoundedIconButton from '@/components/RoundedIconButton';
import { router } from 'expo-router';
import { icons } from '@/constants/icons';
import LottieView from 'lottie-react-native';
import LectureCard from '@/components/LectureCard';

const recommended = () => {

    const { lectures, isLoading, questions } = useAuth();

    const recommendedLects = recommendedLectures(lectures);

    const [expandedLectureId, setExpandedLectureId] = useState<string | null>(null);


    return (
        <View className='w-full h-full bg-background'>
            <SafeAreaView className='w-full h-full'>
                <ScrollView className='w-full h-full bg-background p-5'>
                    <View className='flex-row items-center justify-between'>
                        <RoundedIconButton
                            onPress={() => router.back()}
                            icon={icons.back}
                        />
                        <Text className='font-rubik-semibold text-2xl'>Recommendations</Text>
                        <RoundedIconButton
                            onPress={() => Alert.alert(
                                "Enable AI?",
                                "Do you want to get recommendations from AI?",
                                [{ text: "Yes please!", onPress: () => { } },
                                { text: "No thanks", onPress: () => { }, style: "cancel" }
                                ]
                            )}
                            icon={icons.menu}
                        />
                    </View>
                    <View className='pt-5'>
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
                        {recommendedLects.map((lec) => {
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
                        {recommendedLects.length === 0 && (
                            <View className="w-full items-center pt-10 justify-center">
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
                                            Create more lectures to receive{`\n`}personalized recommendations.
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        )}
                    </View>
                    <View className='h-40' />
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}

export default recommended