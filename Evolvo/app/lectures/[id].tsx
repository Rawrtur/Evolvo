import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect, useState } from 'react';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import RoundedIconButton from '@/components/RoundedIconButton';
import { icons } from '@/constants/icons';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { PieChart } from "react-native-chart-kit";
import LottieView from 'lottie-react-native';

const screenWidth = Dimensions.get("window").width;

const states = [
    { state: "short", color: "#238200" },
    { state: "medium", color: "#dfcd00" },
    { state: "long", color: "#b80000" },
    { state: "none", color: "#3e3e3e" }
]

const LectureDetails = () => {
    const { id } = useLocalSearchParams();
    const { getLectureDetails, isLoading, questions } = useAuth();
    const [lecture, setLecture] = useState(null);


    useEffect(() => {
        const fetchLecture = async () => {
            try {
                const data = await getLectureDetails(id);
                setLecture(data.data.lecture);
            } catch (error) {
                console.error('Fehler beim Laden der Lecture:', error);
            }
        };

        fetchLecture();
    }, [id]);

    const currentQuestions = questions.filter((ques) => ques.lecture === id)

    const pieData = states.map(s => ({
        name: s.state,
        population: currentQuestions.filter(q => q.state === s.state).length,
        color: s.color,
    }))

    if (isLoading) return <LoadingScreen />

    if (!lecture) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Lecture not found</Text>
            </View>
        );
    }

    return (
        <View className='w-full h-full bg-background p-5'>
            <SafeAreaView>
                <View className='flex-row items-center justify-between'>
                    <RoundedIconButton
                        onPress={() => router.back()}
                        icon={icons.back}
                    />
                    <Text className='font-rubik-semibold text-2xl'>{lecture.title}</Text>
                    <TouchableOpacity
                        onPress={() => { }}
                        className='border border-accent rounded-full p-2'
                    >
                        <Ionicons
                            name="trash"
                            size={25}
                            color={colors.accent}
                        />
                    </TouchableOpacity>
                </View>
                {currentQuestions.length !== 0 ? (<View>
                    <PieChart
                        data={pieData}
                        width={screenWidth}
                        height={220}
                        chartConfig={{
                            color: (opacity = 1) => `rgba(0,0,0,${opacity})`,
                        }}
                        accessor={"population"}
                        backgroundColor={"transparent"}
                        paddingLeft={"15"}
                        absolute
                    />
                </View>) : (
                    <View className='w-full items-center'>
                        <LottieView
                            source={require('../../assets/animations/sleep.json')}
                            autoPlay
                            loop
                            style={{ width: 200, height: 200 }}
                        />
                        <Text className='font-rubik-light'>Add questions to show the Pie Chart</Text>
                    </View>
                )}
            </SafeAreaView>
        </View>
    );
};

export default LectureDetails;