import { View, Text, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import RoundedIconButton from '@/components/RoundedIconButton';
import { icons } from '@/constants/icons';
import Button from '@/components/Button';
import LottieView from 'lottie-react-native';


const Lecture = () => {

    const { id } = useLocalSearchParams();

    const { lectures } = useAuth();

    const lecture = lectures.find((lecture) => lecture._id === id);

    const [currentTime, setCurrentTime] = React.useState<string>("60 min");

    const timers = ["30 min", "60 min", "90 min"]
    const timers2 = ["120 min", "150 min", "180 min"]

    return (
        <ScrollView className='w-full h-full bg-background p-5'>
            <View className='flex-row pt-5 items-center justify-between'>
                <RoundedIconButton
                    onPress={() => router.back()}
                    icon={icons.back}
                />
                <Text className='font-rubik-semibold text-2xl max-w-[80%]'>Learning {lecture?.title}</Text>
                <View></View>
            </View>
            <View className='w-full items-center pb-5 pt-3 justify-center'>
                <Text className="font-rubik-light">Enter your study time.</Text>
                <Text className="font-rubik-light">Evolvo guides the rythm.</Text>
            </View>
            <Text className="font-rubik-semibold text-xl">How long do you want to study?</Text>
            <View className='w-full pt-5 flex flex-row gap-5 justify-center'>
                {timers.map((timer, index) => (
                    <TouchableOpacity
                        key={index}
                        className={`border border-accent ${currentTime === timer ? "bg-accent" : "bg-white"} rounded-xl w-[30%] items-center justify-center py-3`}
                        onPress={() => setCurrentTime(timer)}
                    >
                        <Text className={`${currentTime === timer ? "text-white" : "text-black"} font-rubik`}>{timer}</Text>
                    </TouchableOpacity>
                ))}

            </View>
            <View className='w-full pt-5 flex flex-row gap-5 justify-center'>
                {timers2.map((timer, index) => (
                    <TouchableOpacity
                        key={index}
                        className={`border border-accent ${currentTime === timer ? "bg-accent" : "bg-white"} rounded-xl w-[30%] items-center justify-center py-3`}
                        onPress={() => setCurrentTime(timer)}
                    >
                        <Text className={`${currentTime === timer ? "text-white" : "text-black"} font-rubik`}>{timer}</Text>
                    </TouchableOpacity>
                ))}
            </View>
            <View className="pt-10">
                <Button title='Get Started' onPress={() => router.navigate(`/(flow)/${id}/${currentTime}`)} fontStyle="text-white font-rubik-bold" shadow />
                <Text className="font-rubik-light pt-3 text-center">{currentTime} - guided from start to finish</Text>
            </View>
            <View className='w-full items-center'>
                <LottieView
                    source={require('../../../assets/animations/thumbup.json')}
                    autoPlay
                    loop
                    style={{ width: 300, height: 300 }}
                />
            </View>
        </ScrollView>
    )
}

export default Lecture