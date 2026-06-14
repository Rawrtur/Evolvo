/* eslint-disable react-hooks/rules-of-hooks */
import { View, Text, TextInput, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Button from '@/components/Button'
import { useAuth } from '@/context/AuthContext'
import AddButton from '@/components/AddButton'
import CloseButton from '@/components/CloseButton'
import { Link, router } from 'expo-router'

const signin = () => {

    const { signIn, error, isLoading, clearError, setError, isLoggedIn } = useAuth();

    useEffect(() => {
        if (isLoggedIn) router.replace("/(tabs)")

    }, [isLoggedIn])


    const [email, setEmail] = useState("nico-dierking@web.de");
    const [password, setPassword] = useState("123123");
    const [passwordVisible, setPasswordVisible] = useState(true);

    const handleSignIn = async () => {
        clearError();
        if (!email.trim()) {
            setError("Please enter your email");
            return;
        }
        if (!password.trim()) {
            setError("Please enter your password");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters long");
            return;
        }

        const result = await signIn(email, password);

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
                <Text className='font-rubik-bold text-2xl'>Welcome Back!</Text>
                <Text className='font-rubik-light'>Sign In to continue learning.</Text>
            </View>
            <View className='bg-white m-5 border border-accent w-[90%] p-5 rounded-3xl'>
                <Text className='font-rubik-semibold'>Email</Text>
                <View className='flex-row w-full bg-background my-4 p-2 justify-between border border-accent rounded-xl '>
                    <TextInput
                        value={email}
                        placeholder='enter your email...'
                        onChangeText={(text) => setEmail(text)}
                        keyboardType='email-address'
                        className='w-[80%]'
                        editable={!isLoading}

                    />
                    <CloseButton onPress={() => setEmail("")} />
                </View>
                <Text className='font-rubik-semibold'>Password</Text>
                <View className='flex-row w-full bg-background my-4 p-2 justify-between border border-accent rounded-xl '>
                    <TextInput
                        value={password}
                        placeholder='enter your password...'
                        onChangeText={(text) => setPassword(text)}
                        editable={!isLoading}
                        secureTextEntry={passwordVisible}
                        className='w-[80%]'
                    />
                    <View className='flex-row'>
                        <CloseButton onPress={() => setPasswordVisible(!passwordVisible)} />
                    </View>
                </View>
                {error && (
                    <Text className='text-accent pb-4 font-rubik'>{error}</Text>
                )}
                <Button
                    title={isLoading ? "Loading..." : "Continue"}
                    onPress={handleSignIn}
                    style='my-5'
                    fontStyle='text-white'
                    disabled={isLoading}
                />
                <Text className='font-rubik text-center'>
                    You don't have an account? <Link href="/(auth)/signup" className='underline pl-2 text-accent'>
                        Sign Up here!
                    </Link>
                </Text>
            </View>
        </View>
    )
}

export default signin