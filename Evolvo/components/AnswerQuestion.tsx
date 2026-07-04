import { View, Text } from 'react-native'
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
        <View className='w-full items-center justify-center'>
            <Text className='font-rubik-semibold text-xl pb-5'>{question}</Text>
            {showAnswer ? (
                <Button title='Show Answer' onPress={() => setShowAnswer(true)} />
            ) : (
                <View>
                    <Text className='font-rubik-light'>{answer}</Text>
                    <View className='w-full flex flex-row items-center justify-center'>
                        <Button title='Again' onPress={onGood} style='border border-yellow-300 bg-background' />
                        <Button title='Good' onPress={onAgain} style='border border-accent bg-background' />
                        <Button title='Very Good' onPress={onVeryGood} style='border border-green-300 bg-background' />
                    </View>
                </View>
            )}
        </View>
    )
}

export default AnswerQuestion