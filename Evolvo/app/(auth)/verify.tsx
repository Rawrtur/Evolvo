/* eslint-disable react-hooks/rules-of-hooks */
import { View, Text, TextInput, Alert } from 'react-native'
import React, { useState } from 'react'
import Button from '@/components/Button'
import { useAuth } from '@/context/AuthContext'
import AddButton from '@/components/AddButton'
import CloseButton from '@/components/CloseButton'
import { Link, router } from 'expo-router'

const verify = () => {

    const { verify, verified, resendVerify, error, isLoading, clearError, setError } = useAuth();

    const [code, setCode] = useState("");

    const handleResend = async () => {
        clearError();
        const result = await resendVerify(verified);

        if (result.success) {
            setError(`Verification Code sended to ${verified}`);
        } else {
            setError(result.message);
        }

    }

    const handleVerify = async () => {
        clearError();

        if (code.trim().length < 6) {
            setError("Code must be atleast 6 characters long");
        }

        if (!verified) {
            setError("You Account is not listed.")
        }

        const result = await verify(verified, code);


        if (result.success) {
            router.replace("/(tabs)")
        } else {
            setError(result.message);
        }
    }

    return (
        <View className='w-full h-full bg-background items-center pt-20'>
            <View className='flex-row items-center p-5'>
                <View className='bg-accent board w-16 h-16 items-center justify-center'>
                    <Text className='text-white font-rubik-semibold text-4xl'>E</Text>
                </View>
                <View className='pl-2'>
                    <Text className='font-rubik-bold text-2xl'>Evolvo</Text>
                    <Text className='font-rubik'>Smart Learning</Text>
                </View>
            </View>
            <View className='w-full pt-8 pb-6 items-center'>
                <Text className='font-rubik-bold text-2xl'>Check your Inbox!</Text>
                <Text className='font-rubik-light'>You have received an email containing the verification code.</Text>
            </View>
            <View className='bg-white m-5 border border-accent w-[90%] p-5 rounded-3xl'>
                <Text className='font-rubik-semibold'>Enter Verification Code</Text>
                <View className='flex-row w-full bg-background my-4 p-2 justify-between border border-accent rounded-xl '>
                    <TextInput
                        value={code}
                        placeholder='enter your verification code...'
                        onChangeText={(text) => setCode(text)}
                        className='w-[80%]'
                        keyboardType='numeric'
                        editable={!isLoading}

                    />
                    <CloseButton onPress={() => setCode("")} />
                </View>
                {error && (
                    <Text className='text-accent pb-4 font-rubik'>{error}</Text>
                )}
                <Button
                    title={isLoading ? "Loading..." : "Continue"}
                    onPress={handleVerify}
                    fontStyle='text-white'
                    disabled={isLoading}
                    style='my-5'
                />
                <Button
                    title={isLoading ? "Loading..." : "Resend Code"}
                    onPress={handleResend}
                    disabled={isLoading}
                    fontStyle='text-accent'
                    style='border bg-background border-accent mb-5'
                />
                <Text className='font-rubik text-center'>
                    You already have an account? <Link href="/(auth)/signin" className='underline pl-2 text-accent'>
                        Sign In here!
                    </Link>
                </Text>
            </View>
        </View>
    )
}

export default verify