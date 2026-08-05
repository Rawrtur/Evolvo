import { View, Text, TouchableWithoutFeedback, ScrollView, Keyboard, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import RoundedIconButton from '@/components/RoundedIconButton';
import { icons } from '@/constants/icons';
import { useAuth } from '@/context/AuthContext';
import LoadingScreen from '@/components/LoadingScreen';
import ThemeTextInput from '@/components/ThemeTextInput';
import Button from '@/components/Button';

const ShowQuestion = ({ question, answer, onTrash, onPass }: { question: string, answer: string, onTrash: () => void, onPass: () => void }) => {
    return (
        <TouchableOpacity
            className='p-3 border border-accent rounded-2xl shdow-lg'
        >
            <View>
                <Text className='font-rubik-bold'>{question}</Text>
                <Text className='font-rubik-light'>{answer}</Text>
            </View>
            <View className='flex w-full flex-row items-center justify-between'>
                <TouchableOpacity onPress={onPass}>

                    <Ionicons
                        name="log-in"
                        size={35}
                        color={colors.accent}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={onTrash}>
                    <Ionicons
                        name="trash"
                        size={35}
                        color={colors.accent}
                    />
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    )
}


const GenerateQuestions = () => {

    const { topic } = useLocalSearchParams();
    const { generateQuestions, isLoading, error, createQuestion, setError, user } = useAuth();
    const [prompt, setPrompt] = React.useState("Lineare Optimierung");
    const [questions, setQuestions] = React.useState<({ question: string, answer: string })[]>([]);

    const handleAdd = async (question: string, answer: string, k: Number) => {
        try {
            await createQuestion(question, answer, topic, user?._id);
            setQuestions(prev => prev.filter((_, index) => index !== k))
        } catch (error) {
            console.error(error);
        }
    }

    const handleGenerate = async () => {
        try {
            if (prompt.length === 0) {
                setError("Please enter a Topic");
                return
            }
            const { success, message, data } = await generateQuestions(prompt);
            if (success) {
                setQuestions(data)
            }

        } catch (error) {
            console.error(error);
        }
    }


    return (
        <ScrollView className='w-full h-full bg-background p-5'>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView>
                    <View className='flex-row pb-5 items-center justify-between'>
                        <RoundedIconButton
                            onPress={() => router.back()}
                            icon={icons.back}
                        />
                        <Text className='font-rubik-semibold text-2xl'>Generate Questions</Text>
                        <View className='w-9' />
                    </View>
                    {isLoading && (
                        <LoadingScreen />
                    )}
                    {error && (
                        <Text className='font-rubik py-5 text-accent text-xl text-center'>{error}</Text>
                    )}
                    {questions.length === 0 && (
                        <>
                            <ThemeTextInput
                                value={prompt}
                                onChangeText={setPrompt}
                                placeholder={`What is Evolvo?`}
                                title='Enter Subtopic'
                                lines={2}
                                type='default'
                            />
                            <View className='p-5'>
                                <Button
                                    title='Generate Questions'
                                    onPress={handleGenerate}
                                    shadow
                                    fontStyle='rubik-bold text-white'
                                    disabled={isLoading}
                                />
                            </View>
                        </>)}
                    <View className='p-5 items-center justify-center gap-3'>
                        {questions.map((q, k) => (
                            <ShowQuestion
                                key={k}
                                {...q}
                                onTrash={() =>
                                    setQuestions(prev => prev.filter((_, index) => index !== k))
                                }
                                onPass={() => handleAdd(q.question, q.answer, k)}
                            />
                        ))}
                    </View>
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </ScrollView>
    )
}

export default GenerateQuestions