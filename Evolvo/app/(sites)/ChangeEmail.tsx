import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import RoundedIconButton from '@/components/RoundedIconButton'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'
import ThemeTextInput from '@/components/ThemeTextInput'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/Button'

const ChangeEmail = () => {

  const { updateEmail, isLoading, error, user, setError, clearError } = useAuth()

  const [newEmail, setNewEmail] = React.useState("nico-dierking@web.de");
  const [password, setPassword] = React.useState("123123");
  const [status, setStatus] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    clearError();
    if (!newEmail.trim()) {
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
    const response = await updateEmail(user?._id, newEmail.trim(), password.trim());
    if (!response.success) {
      setError(response.message);
    } else {
      setStatus("Changed Email!")
    }
    setNewEmail("");
    setPassword("");
  }

  function isValidEmail(email: string): boolean {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  }

  return (
    <View className='w-full h-full bg-background p-5'>
      <SafeAreaView>
        <View className='flex-row pt-5 items-center justify-between'>
          <RoundedIconButton
            onPress={() => router.back()}
            icon={icons.back}
          />
          <Text className='font-rubik-semibold text-2xl max-w-[80%]'>Change Email</Text>
          <View className='w-9'></View>
        </View>
        <View className='pt-10'>

          <Text className='font-rubik-medium text-xl py-5'>Current Email: <Text className='font-rubik-light text-xl'>{user?.email}</Text></Text>

          <ThemeTextInput
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder='Enter new Email'
            title='Enter new Email'
            type='email-address'
          />
          <ThemeTextInput
            value={password}
            onChangeText={setPassword}
            placeholder='enter you password'
            title='Password'
            type='visible-password'
            visible={false}
          />
          <Text>
            {error}
          </Text>
          <View className='pt-5'>
            <Button
              title='Submit'
              shadow
              fontStyle='font-rubik-bold text-white'
              onPress={handleSubmit}
              disabled={!isValidEmail(newEmail.trim())}
            />
          </View>
          <Text className='font-rubik-bold text-green-500 text-2xl text-center pt-5'>{status}</Text>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default ChangeEmail