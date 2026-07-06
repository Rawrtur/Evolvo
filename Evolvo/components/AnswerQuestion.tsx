import { View, Text, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Button from './Button';

const AnswerQuestion = ({ question, answer, onGood, onAgain, onVeryGood }:
    {
        question: string,
        answer: string,
        onGood: () => void,
        onAgain: () => void,
        onVeryGood: () => void
    }) => {

    const [showAnswer, setShowAnswer] = useState(false);

    return (
        <View className='w-full items-center justify-center h-[90%]'>
            <View className='border-b border-accent w-full mb-5 pb-5 justify-center items-center'>
            <Text className='font-rubik-semibold text-xl'>{question}</Text>
            </View>
            {showAnswer ? (
                <>
                    <Text className='font-rubik-medium pb-20'>{answer}</Text>
                    <View className='w-full flex flex-col gap-5 items-center justify-center'>
                        <View className='w-full flex flex-row items-center justify-between gap-5'>
                            <TouchableOpacity
                                onPress={onAgain}
                                className='items-center justify-center border border-accent rounded-xl py-5 w-[30%]'
                            >
                                <Text className='font-rubik-semibold'>Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onGood}
                                className='items-center justify-center border border-yellow-500 rounded-xl py-5 w-[30%]'
                            >
                                <Text className='font-rubik-semibold'>Good</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={onVeryGood}
                                className='items-center justify-center border border-green-300 rounded-xl py-5 w-[30%]'
                            >
                                <Text className='font-rubik-semibold'>Very Good</Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                </>
            ) : (
                <TouchableOpacity
                    className='w-[90%] py-5 rounded-xl border border-accent items-center justify-center'
                    onPress={() => setShowAnswer(!showAnswer)}
                >
                    <Text className='font-rubik-semibold'>Show Answer</Text>
                </TouchableOpacity>
            )}
        </View>
    )
}

export default AnswerQuestion;