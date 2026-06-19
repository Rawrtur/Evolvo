import { View, Text, TextInput } from 'react-native'
import React from 'react'
import CloseButton from './CloseButton'

const ThemeTextInput = ({ value, onChangeText, placeholder, title, lines = 1 }:
    { value: string, onChangeText: (text: string) => void, placeholder: string, title: string, lines?: number }) => {
    return (
            <View>
                <Text className='font-rubik-semibold'>{title}</Text>
                <View className='flex-row w-full bg-background my-4 p-2 justify-between border border-accent rounded-xl '>
                    <TextInput
                        value={value}
                        placeholder={placeholder}
                        onChangeText={(text) => onChangeText(text)}
                        className='w-[80%]'
                        multiline
                        numberOfLines={lines}
                        textAlignVertical='top'
                    />
                    <CloseButton onPress={() => onChangeText("")} />
                </View>
            </View>
    )
}

export default ThemeTextInput