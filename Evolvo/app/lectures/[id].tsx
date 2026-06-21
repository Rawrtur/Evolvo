import { View, Text, TouchableOpacity, Dimensions, Alert, ScrollView, TouchableWithoutFeedback, Keyboard } from 'react-native';
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
import { LinearGradient } from "expo-linear-gradient";
import ThemeTextInput from '@/components/ThemeTextInput';
import Button from '@/components/Button';
import Question from '@/components/Question';

const screenWidth = Dimensions.get("window").width;

const states = [
    { state: "short", color: "#238200" },
    { state: "medium", color: "#dfcd00" },
    { state: "long", color: "#b80000" },
    { state: "none", color: "#3e3e3e" }
]

const LectureDetails = () => {
    const { id } = useLocalSearchParams();
    const { getLectureDetails, isLoading, questions, deleteLecture, createQuestion, user, deleteQuestion } = useAuth();
    const [lecture, setLecture] = useState(null);
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [loading, setIsloding] = useState(false);


    useEffect(() => {
        const fetchLecture = async () => {
            setIsloding(true);
            try {
                const data = await getLectureDetails(String(id));
                setLecture(data.data.lecture);
            } catch (error) {
                console.error('Fehler beim Laden der Lecture:', error);
            } finally {
                setIsloding(false);
            }
        };

        fetchLecture();
    }, [id, getLectureDetails]);


    const handleDelete = async () => {
        try {
            const data = await deleteLecture(String(id));

            if (data.success) {
                router.back();
            };

        } catch (error) {
            console.log(error)
        }
    }

    const handleDeleteQuestion = async (id: string) => {
        try {
            await deleteQuestion(id);
        } catch (error) {
            console.log(error)
        }
    }

    const handleAddQuestion = async () => {
        try {
            setIsloding(true);
            await createQuestion(question, answer, lecture?._id, user?._id)
        } catch (error: any) {
            console.error(error)
        } finally {
            setAnswer("");
            setQuestion("");
            setIsloding(false);
        }
    }

    const currentQuestions = questions.filter((ques) => ques.lecture === id)

    const pieData = states.map(s => ({
        name: s.state,
        population: currentQuestions.filter(q => q.state === s.state).length,
        color: s.color,
    }))

    if (isLoading || loading) return <LoadingScreen />

    if (!lecture) {
        return (
            <View className="flex-1 items-center justify-center">
                <Text>Lecture not found</Text>
            </View>
        );
    }

    const createQuestionButtonEnable = isLoading || (question.length === 0) || (answer.length === 0)

    return (
        <ScrollView className='w-full h-full bg-background p-5'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView>
                    <View className='flex-row items-center justify-between'>
                        <RoundedIconButton
                            onPress={() => router.back()}
                            icon={icons.back}
                        />
                        <Text className='font-rubik-semibold text-2xl'>{lecture.title}</Text>
                        <TouchableOpacity
                            onPress={() => Alert.alert(`Delete Lecture?`, `Do you want to delete ${lecture.title}?`, [
                                { text: "Yes", onPress: () => handleDelete() },
                                { text: "No", onPress: () => { }, style: "cancel" }
                            ])}
                            className='border border-accent rounded-full p-2'
                        >
                            <Ionicons
                                name="trash"
                                size={25}
                                color={colors.accent}
                            />
                        </TouchableOpacity>
                    </View>
                    {currentQuestions.length !== 0 && (<View>
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
                    </View>)}
                    {currentQuestions.length === 0 && !(loading || isLoading) && (
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
                    {(loading || isLoading) && (
                        <View className='w-full items-center'>
                            <LottieView
                                source={require('../../assets/animations/loading.json')}
                                autoPlay
                                loop
                                style={{ width: 200, height: 200 }}
                            />
                        </View>
                    )}
                    <View className='w-full py-5 gap-3'>
                        <Button title='Start Learning' onPress={() => { }} fontStyle='font-rubik-semibold text-white' />
                        <Button title='Learn Questions' disabled={currentQuestions.length === 0} onPress={() => { }} fontStyle='font-rubik-semibold ' style='bg-background border border-black' />
                    </View>

                    <View className='w-full items-center mt-5 mb-5'>
                        <View className='w-full bg-muted border border-accent rounded-lg p-5'>
                            <ThemeTextInput
                                value={question}
                                onChangeText={setQuestion}
                                placeholder='What is Evolvo...'
                                title='Enter Question'
                                lines={4}
                            />
                            <ThemeTextInput
                                value={answer}
                                onChangeText={setAnswer}
                                placeholder='An AI-powered learning app'
                                title='Enter you answer'
                            />
                            <Button title='Add Question' onPress={handleAddQuestion} fontStyle='text-white' disabled={createQuestionButtonEnable} />

                        </View>
                    </View>
                    <View className='w-full pb-5'>
                        <Text className='font-rubik-semibold text-3xl'>Questions:</Text>
                        {currentQuestions.map((q) => (
                            <Question key={q._id} answer={q.answer} question={q.question} onPress={() => handleDeleteQuestion(q._id)} />
                        ))}
                        {currentQuestions.length === 0 && (
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
                    </View>
                    <View className='w-full items-center p-5 mt-10 border border-accent rounded-3xl bg-muted'>
                        <Text className='font-rubik-semibold text-xl pb-3'>
                            👑 Ask AI (Premium)
                        </Text>

                        <Text className='font-rubik text-center pb-3'>
                            Generate personalised questions automatically with the help of AI.
                        </Text>
                        <TouchableOpacity
                            className='border border-accent border-2'
                            onPress={() => { }}
                        >
                            <LinearGradient
                                colors={["#FBBF24", "#F59E0B"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                className="rounded-2xl px-6 py-4"
                            >
                                <Text className="text-center font-rubik-semibold text-white">
                                    ✨ generate AI-Questions
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    <View className="w-full items-center justify-center h-[200px]">
                        <LottieView
                            source={require('../../assets/animations/thumbup.json')}
                            autoPlay
                            loop
                            style={{ width: 300, height: 300 }}
                        />
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </ScrollView >
    );
};

export default LectureDetails;