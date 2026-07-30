import { View, Text } from 'react-native'
import React from 'react'
import CountdownTimer from './Timer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import SquareLoader from './SquareLoader';

const Break = ({ time, setIndex, index }: { time: number, setIndex: (index: number) => void, index: number }) => {

    const skipPreStudy = async () => {
        await AsyncStorage.removeItem('timerValue');
        await AsyncStorage.setItem('flowIndex', `${index + 1}`);
        setIndex(index + 1)
    }


    // zufallswert fuer pausenaktion
    const randomNumber = React.useMemo(() => {
        return Math.floor(Math.random() * 3)
    }, [index])

    return (
        <View className="p-5 w-full">
            <View className="items-center justify-center w-full">
                <Text className="bg-accent text-white py-3 px-10 text-2xl font-rubik-medium rounded-full">Break</Text>
                <Text className="font-rubik text-center pt-5">A moment to relax your mind.</Text>
            </View>
            <CountdownTimer initialTime={60 * time} onComplete={skipPreStudy} />
            <View className="p-5 border border-accent rounded-xl bg-white items-center justify-center">
                {randomNumber === 0 && (
                    <>
                        <LottieView
                            source={require("../assets/animations/sleep.json")}
                            autoPlay
                            loop
                            style={{ width: 300, height: 300 }}
                        />
                        <Text className="font-rubik-bold text-2xl">Take a Break</Text>
                    </>
                )}
                {randomNumber === 1 && (
                    <SquareLoader />
                )}
                {randomNumber === 2 && (
                    <View>
                        <Text>nij</Text>
                    </View>
                )}
            </View>
        </View>
    )
}

export default Break