import { View, Text } from 'react-native'
import React from 'react'
import CountdownTimer from './Timer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';


const Focus = ({ time, setIndex, index }: { time: number, setIndex: (index: number) => void, index: number }) => {

    const skipPreStudy = async () => {
        await AsyncStorage.removeItem('timerValue');
        await AsyncStorage.setItem('flowIndex', `${index + 1}`);
        setIndex(index + 1)
    }

    return (
        <View className="p-5 w-full">
            <View className="items-center justify-center w-full">
                <Text className="bg-accent text-white py-3 px-10 text-2xl font-rubik-medium rounded-full">Focus</Text>
                <Text className="font-rubik text-center pt-5">A focused timed session</Text>
            </View>
            <CountdownTimer initialTime={60 * time} onComplete={skipPreStudy} />
            <View className="p-5 border border-accent rounded-xl bg-white items-center justify-center">
                <LottieView
                    source={require("../assets/animations/thumbup.json")}
                    autoPlay
                    loop
                    style={{ width: 300, height: 300 }}
                />
                <Text className="font-rubik-bold text-2xl">You can do it!</Text>
            </View>
        </View>
    )
}

export default Focus