import { View, Text, TouchableOpacity, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import Button from './Button';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '@/constants/theme';
import { useAuth } from '@/context/AuthContext';

const AnswerQuestion = ({ question, answer, onGood, onAgain, onVeryGood, id, state, lastAnswered }:
    {
        question: string,
        answer: string,
        onGood: () => void,
        onAgain: () => void,
        onVeryGood: () => void,
        id: String | string[],
        state: string,
        lastAnswered: Date
    }) => {

    const { updateQuestion } = useAuth();

    const [showAnswer, setShowAnswer] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editQuestion, setEditQuestion] = useState(question);
    const [editAnswer, setEditAnswer] = useState(answer)

    const handleEdit = async () => {
        await updateQuestion(id, editQuestion, editAnswer, state, lastAnswered);
        setEditMode(false)
    }

    const handleCut = async () => {
        await updateQuestion(id, question, answer, "none", lastAnswered);
    }

    return (
        <View className='w-full items-center justify-center h-[90%]'>
            <View className='border-b border-accent w-full mb-5 pb-5 justify-center items-center'>
                {editMode ? (
                    <View className='flex-row justify-center items-center gap-5'>
                        <TextInput
                            value={editQuestion}
                            onChangeText={(text) => setEditQuestion(text)}
                            multiline
                            // numberOfLines={3}
                            className='w-[80%]'
                        />
                        <Ionicons name='pencil' size={20} />
                    </View>
                ) : <Text className='font-rubik-semibold text-xl'>{question}</Text>}
            </View>
            {showAnswer ? (
                <>
                    {editMode ? (
                        <View className='flex-row justify-center items-center gap-5'>
                            <TextInput
                                value={editAnswer}
                                onChangeText={(text) => setEditAnswer(text)}
                                multiline
                                // numberOfLines={3}
                                className='w-[80%]'
                            />
                            <Ionicons name='pencil' size={20} />
                        </View>
                    ) : <Text className='font-rubik-medium pb-20'>{answer}</Text>}
                    <View className='w-full flex flex-col gap-5 items-center justify-center'>
                        {!editMode && (<View className='w-full flex flex-row items-center justify-between gap-5'>
                            <TouchableOpacity
                                onPress={() => { onAgain(); setShowAnswer(false) }}
                                disabled={editMode}
                                className='items-center justify-center border border-accent rounded-xl py-5 w-[30%]'
                            >
                                <Text className='font-rubik-semibold'>Again</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => { onGood(); setShowAnswer(false) }}
                                disabled={editMode}
                                className='items-center justify-center border border-yellow-500 rounded-xl py-5 w-[30%]'
                            >
                                <Text className='font-rubik-semibold'>Good</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                disabled={editMode}
                                onPress={() => { onVeryGood(); setShowAnswer(false) }}
                                className='items-center justify-center border border-green-300 rounded-xl py-5 w-[30%]'
                            >
                                <Text className='font-rubik-semibold'>Very Good</Text>
                            </TouchableOpacity>
                        </View>
                    )}

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
            {editMode && (
                <View className='w-full items-center justify-center pt-5'>
                    <Button title='Save' onPress={handleEdit} fontStyle='font-rubik-bold text-white' />
                </View>
            )}
            <View className='w-full pt-20 flex-row gap-5 justify-center items-center'>
                <TouchableOpacity
                    className='border border-accent rounded-xl p-3 bg-muted'
                    onPress={() => setEditMode(true)}
                >
                    <Ionicons name='pencil' size={30} color={colors.accent} />
                </TouchableOpacity>
                <TouchableOpacity
                    className='border border-accent rounded-xl p-3 bg-muted'
                    onPress={() => Alert.alert(`Remove Lecture?`, `do you want to remove this question?\n(You can still add it later)`, [
                        { text: "Yes", onPress: handleCut },
                        { text: "No", onPress: () => { }, style: "cancel" }
                    ])}
                >
                    <Ionicons name='cut' size={30} color={colors.accent} />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default AnswerQuestion;