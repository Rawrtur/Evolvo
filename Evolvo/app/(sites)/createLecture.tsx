/* eslint-disable react-hooks/rules-of-hooks */
import { View, Text, TouchableOpacity, Image } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'
import { icons } from '@/constants/icons'
import ThemeTextInput from '@/components/ThemeTextInput'
import LottieView from 'lottie-react-native'
import Button from '@/components/Button'
import { useAuth } from '@/context/AuthContext'
import { Ionicons } from '@expo/vector-icons'


const colors: ["#f5c542", "#e8def8", "#b8d4e3", "#b8e8d0"] = ["#f5c542", "#e8def8", "#b8d4e3", "#b8e8d0"]
const displayIcons: ["book", "calculator", "pulse", "flask", "code"] = ["book", "calculator", "pulse", "flask", "code"]

const types = ["Practise", "Calculate", "Theory", "Experimental", "Project"]

const createLecture = () => {

    const { isLoading, createLecture, user, error, setError } = useAuth();

    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#f5c542");
    const [icon, setIcon] = useState("book");
    const [type, setType] = useState("Practise");

    const handleCreate = async () => {
        try {
            if (user) {
                const data = await createLecture(title, color, icon, type, user._id);

                if (data.success) {
                    setTitle("");
                    setColor("#ba6363");
                    setIcon("book");
                    setType("Practise");
                    router.back()
                }
            }
        } catch (error: any) {
            setError(error.message)
        }
    };


    return (
        <SafeAreaView>
            <View className='w-full h-full bg-background items-center'>
                <View className="w-full flex-row items-center p-5">
                    <View className="flex-1">
                        <TouchableOpacity onPress={() => router.back()}>
                            <Image source={icons.back} className="h-10 w-10" />
                        </TouchableOpacity>
                    </View>
                    <Text className="font-rubik-semibold text-2xl text-accent">
                        Create New Lecture
                    </Text>
                    <View className="flex-1" />
                </View>
                <View className='w-[80%]'>
                    <ThemeTextInput
                        value={title}
                        title='Lecture'
                        placeholder='enter Lecture name'
                        onChangeText={setTitle}
                    />
                </View>
                <View className='w-[80%] flex-row justify-center'>
                    {colors.map((c, key) => (
                        <TouchableOpacity
                            onPress={() => setColor(c)}
                            key={key}
                            className={`h-10 m-1 w-10 border rounded-full ${color === c ? "border-2" : "border-0"}`}
                            style={{ backgroundColor: c }} />
                    ))}
                </View>
                <View className='w-[80%] flex-row justify-center'>
                    {displayIcons.map((i, key) => (
                        <TouchableOpacity
                            onPress={() => setIcon(i)}
                            key={key}
                            className={`h-10 m-1 w-10 items-center justify-center border rounded-full ${icon === i ? "border-2 bg-accent" : "border-0"}`}
                        >
                            <Ionicons
                                name={i}
                                size={30}
                                color="black" />
                        </TouchableOpacity>
                    ))}
                </View>
                <View className="flex-row flex-wrap gap-2 w-[80%] justify-center pt-5">
                    {types.map((t) => (
                        <TouchableOpacity
                            key={t}
                            onPress={() => setType(t)}
                            className={`px-4 py-2 rounded-full border ${type === t
                                ? "bg-accent border-accent"
                                : "bg-white border-gray-300"
                                }`}
                        >
                            <Text
                                className={`${type === t
                                    ? "text-white font-rubik-semibold"
                                    : "text-black"
                                    }`}
                            >
                                {t}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <View className='w-full justify-center items-center'>
                    <LottieView
                        source={require('../../assets/animations/wave.json')}
                        autoPlay
                        loop
                        style={{ width: 200, height: 200 }}
                    />
                    <Button
                        title='Create'
                        onPress={handleCreate}
                        disabled={title.length === 0 || isLoading}
                        fontStyle='text-white font-rubik-semibold' />
                    <Text className='font-rubik-light text-accent'>{error}</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default createLecture