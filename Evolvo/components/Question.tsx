import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React from 'react'
import RoundedIconButton from './RoundedIconButton'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/constants/theme'

const Question = ({ answer, question, onPress }: { answer: string, question: string, onPress: () => void }) => {
    return (
        <View className='border-b border-accent py-2 flex-row items-center justify-between'>
            <View>
                <Text className='font-rubik-semibold' numberOfLines={1}>{question}</Text>
                <Text className='font-rubik-ligt text-gray-600' numberOfLines={1}>{answer}</Text>
            </View>
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
    )
}

export default Question