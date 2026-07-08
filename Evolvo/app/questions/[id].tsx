import { View, Text, ScrollView, TouchableWithoutFeedback, Keyboard, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useEffect } from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { icons } from '@/constants/icons';
import RoundedIconButton from '@/components/RoundedIconButton';
import { getDaysAgo } from '@/utils/getAge';
import LoadingScreen from '@/components/LoadingScreen';
import Review from '@/components/Review';


const Questions = () => {
    const { id } = useLocalSearchParams();
    const { lectures, isLoading } = useAuth();

    const lecture = lectures.find(l => l._id === id);


    if (isLoading) return <LoadingScreen />

    return (
        <ScrollView className='w-full h-full bg-background p-5'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView>
                    <View className='flex-row items-center justify-between'>
                        <RoundedIconButton
                            onPress={() => router.back()}
                            icon={icons.back}
                        />
                        <Text className='font-rubik-semibold text-xl'>Questions for {lecture?.title}</Text>
                        <View className='w-9' />
                    </View>
                    <View className='h-20'/>
                    <Review id={id} showHeader={false}/>
                    {/* <View className='w-full pt-20 items-center justify-center'>
                        <TouchableOpacity
                            className='border border-2 rounded-full w-[90%] py-5 items-center justify-center'
                        >
                            <Text className='font-rubik-bold text-xl'>
                                Finish
                            </Text>
                        </TouchableOpacity>
                    </View> */}
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </ScrollView>
    )
}

export default Questions