import { View, Text, TextInput } from 'react-native'
import React from 'react'
import CloseButton from './CloseButton'

const ThemeTextInput = ({ value, onChangeText, placeholder, title, lines = 1, type="default", visible=true }:
    { value: string, onChangeText: (text: string) => void, placeholder: string, title: string, lines?: number, type?:"default" | "numeric" | "email-address" | "visible-password" | undefined, visible?:boolean }) => {
    return (
            <View>
                <Text className='font-rubik-semibold'>{title}</Text>
                <View className='flex-row w-full bg-background my-4 p-2 justify-between border border-accent rounded-xl '>
                    <TextInput
                        value={value}
                        keyboardType={type}
                        placeholder={placeholder}
                        onChangeText={(text) => onChangeText(text)}
                        className='w-[80%]'
                        multiline
                        numberOfLines={lines}
                        textAlignVertical='top'
                        secureTextEntry={visible}
                    />
                    <CloseButton onPress={() => onChangeText("")} />
                </View>
            </View>
    )
}

export default ThemeTextInput