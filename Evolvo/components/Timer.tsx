import React, { useState, useEffect, useRef } from "react";
import { View, Text} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function CountdownTimer({ initialTime = 60, onComplete }:{ initialTime?: number, onComplete?: () => void }) {

    useEffect(()=> {
        const setTimer = async( ) => {
            // await AsyncStorage.removeItem('timerValue');
            const value = await AsyncStorage.getItem('timerValue');
            if (value ) {
                const remaining = Math.max(0, Math.ceil((Number(value) - Date.now()) / 1000));
                setTimeLeft(remaining);
            } else {
                await AsyncStorage.setItem('timerValue', (Date.now() + initialTime * 1000).toString());
                setTimeLeft(initialTime);
            }
        }
        setTimer();
    },[])


    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isRunning, setIsRunning] = useState(true);

    const intervalRef = useRef(null);

    useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(async () => {
        const value = await AsyncStorage.getItem("timerValue");
        if (!value) return;

        const endTime = Number(value);

        const remaining = Math.max(
            0,
            Math.ceil((endTime - Date.now()) / 1000)
        );

        setTimeLeft(remaining);

        if (remaining === 0) {
            clearInterval(interval);
            setIsRunning(false);
            await AsyncStorage.removeItem("timerValue");
            if (onComplete) {
                onComplete();
            }
        }
    }, 250);

    intervalRef.current = interval;

    return () => clearInterval(interval);
}, [isRunning]);

    const startTimer = () => {
        if (timeLeft > 0) {
            setIsRunning(true);
        }
    };

    const pauseTimer = () => {
        clearInterval(intervalRef.current);
        setIsRunning(false);
    };


    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;

        return `${String(mins).padStart(2, "0")}:${String(secs).padStart(
            2,
            "0"
        )}`;
    };

    return (
        <View className="w-full items-center pt-10">
            <Text className="font-rubik-semibold text-accent text-6xl">{formatTime(timeLeft)}</Text>
            <View className="bg-gray-300 w-full h-[10px] rounded-full mt-5 mb-10">
                <View className={`bg-accent h-[10px] rounded-full`} style={{ width: `${(((timeLeft) / initialTime) * 100).toFixed(1)}%` }}></View>
            </View>
            {/* <View className="w-full justify-center items-center">
                <Ionicons
                    name={isRunning ? "pause" : "play"}
                    size={40}
                    color="black"
                    onPress={isRunning ? pauseTimer : startTimer}
                />
            </View> */}
        </View>
    );
}
