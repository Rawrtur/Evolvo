import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/constants/theme'
import { useAuth } from '@/context/AuthContext'

const Question = ({ answer, question, onPress, state,_id, lastAnswered }: { answer: string, question: string, onPress: () => void, state:string, _id:string, lastAnswered:Date }) => {

    const {updateQuestion} = useAuth();

    const handleAdd = async () => {
        await updateQuestion(_id, question, answer, "short", lastAnswered);
    }

    return (
        <View className='border-b border-accent py-2 flex-row items-center justify-between'>
            <View className='w-[80%]'>
                <Text className='font-rubik-semibold' numberOfLines={1}>{question}</Text>
                <Text className='font-rubik-ligt text-gray-600' numberOfLines={1}>{answer}</Text>
            </View>
            <View className='flex-row gap-5'>
                {state === "none" && (<TouchableOpacity
                    onPress={() => Alert.alert(`Add Question?`, `Do you want to add the Question?`, [
                        { text: "Yes", onPress: handleAdd },
                        { text: "No", onPress: () => { }, style: "cancel" }
                    ])}
                >
                    <Ionicons
                        name="log-in"
                        size={25}
                        color={colors.accent}
                    />
                </TouchableOpacity>)}
                <TouchableOpacity
                    onPress={() => Alert.alert(`Delete Question?`, `Do you want to delete Question?`, [
                        { text: "Yes", onPress: onPress },
                        { text: "No", onPress: () => { }, style: "cancel" }
                    ])}
                >
                    <Ionicons
                        name="trash"
                        size={25}
                        color={colors.accent}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

export default Question