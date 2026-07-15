import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'
import CloseButton from './CloseButton'
import RoundedIconButton from './RoundedIconButton'
import { Ionicons } from '@expo/vector-icons'
import { colors } from '@/constants/theme'

const ThemeTextInput = ({ value, onChangeText, placeholder, title, lines = 1, type = "default", visible = true }: ThemeTextInputProps) => {

    const [secure, setSecure] = React.useState(!visible);

    return (
        <View>
            <Text className='font-rubik-semibold'>{title}</Text>
            <View className='flex-row w-full bg-background my-4 p-2 justify-between border border-accent rounded-xl '>
                <TextInput
                    value={value}
                    keyboardType={type === "visible-password" ? "default" : type}
                    placeholder={placeholder}
                    onChangeText={(text) => onChangeText(text)}
                    className='w-[80%]'
                    multiline={lines > 1}
                    numberOfLines={lines > 1 ? lines : undefined}
                    textAlignVertical={lines > 1 ? "top" : "center"}
                    secureTextEntry={secure}
                    autoCorrect={false}
                    autoCapitalize="none"
                />
                {value.length > 0 && type !== "visible-password" && (
                    <CloseButton onPress={() => onChangeText("")} />
                )}
                {type === "visible-password" && (
                    <TouchableOpacity
                        className='justify-center items-center'
                        onPress={() => setSecure(!secure)}
                    >
                        <Ionicons name='eye' size={30} color={colors.accent} />
                    </TouchableOpacity>
                )}
            </View>
        </View>
    )
}

export default ThemeTextInput