import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import CountdownTimer from './Timer'
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import AddButton from './AddButton';
import { router } from 'expo-router'
import RoundedIconButton from './RoundedIconButton';
import { icons } from '@/constants/icons';
import ThemeTextInput from './ThemeTextInput';
import Button from './Button';
import { useAuth } from '@/context/AuthContext';
import CloseButton from './CloseButton';


const Focus = ({ time, setIndex, index, topic, id }: { time: number, setIndex: (index: number) => void, index: number, topic: string, id: string }) => {

    const skipPreStudy = async () => {
        await AsyncStorage.removeItem('timerValue');
        await AsyncStorage.setItem('flowIndex', `${index + 1}`);
        setIndex(index + 1)
    }

    const { isLoading, user, createQuestion } = useAuth();

    const [showAddQuestion, setShowAddQuestion] = React.useState(false);
    const [question, setQuestion] = React.useState('');
    const [answer, setAnswer] = React.useState('');
    const [loading, setIsloding] = useState(false);


    const createQuestionButtonEnable = isLoading || (question.length === 0) || (answer.length === 0)

    const handleAddQuestion = async () => {
        try {
            setIsloding(true);
            await createQuestion(question, answer, id, user?._id)
        } catch (error: any) {
            console.error(error)
        } finally {
            setAnswer("");
            setQuestion("");
            setIsloding(false);
            setShowAddQuestion(false);
        }
    }

    return (
        <View className="p-5 w-full">
            {showAddQuestion && (
                <View className="absolute top-0 left-0 right-0 bottom-0 items-center justify-center z-50">
                    <View className='w-full items-center shadow-lg'>
                        <View className='w-full bg-white border border-accent rounded-lg p-5'>
                            <CloseButton onPress={() => setShowAddQuestion(false)} style="absolute right-2 top-2" size={2} />
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
                </View>
            )}
            <View className="items-center justify-center w-full">
                <Text className="bg-accent text-white py-2 px-10 text-xl font-rubik-medium rounded-full">Focus</Text>
                <Text className="font-rubik text-center pt-2">A focused timed session</Text>
            </View>
            <CountdownTimer initialTime={60 * time} onComplete={skipPreStudy} />
            <View className="p-5 border border-accent rounded-xl bg-white items-center justify-center mb-20">
                <LottieView
                    source={require("../assets/animations/thumbup.json")}
                    autoPlay
                    loop
                    style={{ width: 250, height: 250 }}
                />
                <Text className="font-rubik-bold text-2xl">You can do it!</Text>
            </View>
            <View className="flex-row w-full items-center justify-center gap-5">
                <View className="flex-col items-center gap-3">
                    <AddButton onPress={() => setShowAddQuestion(true)} />
                    <Text className="font-rubik text-center pt-2">Add Questions</Text>
                </View>
                <View className="flex-col items-center gap-3">
                    <TouchableOpacity
                        onPress={() => router.navigate(`/feynman/${topic}`)}
                        key={1}
                        className={`rounded-full w-[40px] h-[40px] items-center justify-center`}
                    >
                        <Text className='text-4xl text-center text-accent'>
                            <Image source={icons.feynman} />
                        </Text>
                    </TouchableOpacity>
                    <Text className="font-rubik text-center pt-2">Feynman Technique</Text>
                </View>
            </View>
        </View>
    )
}

export default Focus