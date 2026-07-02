import { View, Text } from 'react-native'
import React from 'react'
import CountdownTimer from './Timer'
import LottieView from 'lottie-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


const PreStudy = ({setIndex}:{setIndex: (index: number) => void}) => {


    const skipPreStudy = async () => {
        await AsyncStorage.removeItem('timerValue');
        await AsyncStorage.setItem('flowIndex', '2');
        setIndex(2)
    }

    return (
        <View className="p-5 w-full">
            <View className="items-center justify-center w-full">
                <Text className="bg-accent text-white py-3 px-10 text-2xl font-rubik-medium rounded-full">Pre Study reset</Text>
                <Text className="font-rubik text-center pt-5">A moment to clear your desk before you begin.</Text>
            </View>
            <CountdownTimer initialTime={60} onComplete={skipPreStudy} />
            <View className="p-5 border border-accent rounded-xl bg-white items-center justify-center">
                <LottieView
                    source={require("../assets/animations/thumbup.json")}
                    autoPlay
                    loop
                    style={{ width: 300, height: 300 }}
                />
                <Text className="font-rubik-bold text-2xl">Put Distractions away</Text>
            </View>
        </View>
    )
}

export default PreStudy