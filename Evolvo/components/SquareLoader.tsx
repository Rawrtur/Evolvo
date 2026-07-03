import React, { useEffect } from "react";
import { View, Text } from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
    Easing,
} from "react-native-reanimated";

const SIZE = 220;
const DOT_SIZE = 18;
const PERIMETER = SIZE * 4;
const BORDER_WIDTH = 5;
const OFFSET = BORDER_WIDTH / 2;

export default function SquareLoader() {
    const progress = useSharedValue(0);

    useEffect(() => {
        progress.value = withRepeat(
            withTiming(PERIMETER, {
                duration: 16000,
                easing: Easing.linear,
            }),
            -1,
            false
        );
    }, []);

    const dotStyle = useAnimatedStyle(() => {
        const p = progress.value;

        let x = 0;
        let y = 0;

        if (p <= SIZE) {
            // oben
            x = p;
            y = 0;
        } else if (p <= SIZE * 2) {
            // rechts
            x = SIZE;
            y = p - SIZE;
        } else if (p <= SIZE * 3) {
            // unten
            x = SIZE - (p - SIZE * 2);
            y = SIZE;
        } else {
            // links
            x = 0;
            y = SIZE - (p - SIZE * 3);
        }

        return {
            transform: [
                { translateX: x - DOT_SIZE / 2 - 5.5 },
                { translateY: y - DOT_SIZE / 2 - 5.5 },
            ],
        };
    });

    return (
        <View className="justify-center items-center">
            <View className="border border-5 border-gray-300 rounded-xl" style={{ width: SIZE, height: SIZE }}>
                <Animated.View style={[dotStyle, {
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    borderRadius: DOT_SIZE / 2,
                }]} className="absolute bg-accent" />
            </View>
            <Text className="font-rubik-bold text-2xl text-accent pt-5">Take a deep breath</Text>
            <Text className="font-rubik text-center">Breath in when the dot is rising</Text>
            <Text className="font-rubik text-center">Breath out when the dot is sinking</Text>
        </View >
    );
}
