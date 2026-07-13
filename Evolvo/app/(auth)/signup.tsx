/* eslint-disable react-hooks/rules-of-hooks */
import { View, Text, TextInput } from 'react-native'
import React, { useState } from 'react'
import Button from '@/components/Button'
import { useAuth } from '@/context/AuthContext'
import CloseButton from '@/components/CloseButton'
import { Link, router } from 'expo-router'

const signup = () => {

  const { signUp, error, isLoading, clearError, setError, verified } = useAuth();

  const [email, setEmail] = useState("nico-dierking@web.de");
  const [name, setName] = useState("Artur");
  const [password, setPassword] = useState("123123");
  const [resumePassword, setResumePassword] = useState("123123");
  const [passwordVisible, setPasswordVisible] = useState(true);

  React.useEffect(() => {
    if (verified) router.replace("/(auth)/verify")
  }, [verified])

  const handleSignUp = async () => {
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
    if (password !== resumePassword) {
      setError("Password must be the same.");
      return;
    }

    const result = await signUp(name, email, password);


    if (result.success) {
      router.replace("/(auth)/verify")
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
      <View className='bg-white m-5 border border-accent w-[90%] p-5 rounded-3xl'>
        <Text className='font-rubik-semibold'>Name</Text>
        <View className='flex-row w-full bg-background my-4 p-2 justify-between border border-accent rounded-xl '>
          <TextInput
            value={name}
            placeholder='enter your email...'
            onChangeText={(text) => setName(text)}
            className='w-[80%]'
            editable={!isLoading}

          />
          <CloseButton onPress={() => setEmail("")} />
        </View>
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
        <Text className='font-rubik-semibold'>Confirm Password</Text>
        <View className='flex-row w-full bg-background my-4 p-2 justify-between border border-accent rounded-xl '>
          <TextInput
            value={resumePassword}
            placeholder='Confirm your password...'
            onChangeText={(text) => setResumePassword(text)}
            editable={!isLoading}
            secureTextEntry
            className='w-[80%]'
          />
          <View className='flex-row'>
            <CloseButton onPress={() => setResumePassword("")} />
          </View>
        </View>
        {error && (
          <Text className='text-accent pb-4 font-rubik'>{error}</Text>
        )}
        <Button
          title={isLoading ? "Loading..." : "Continue"}
          onPress={handleSignUp}
          style='my-5'
          fontStyle='text-white'
          disabled={isLoading}
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

export default signup