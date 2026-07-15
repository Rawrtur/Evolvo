import { View, Text } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import RoundedIconButton from '@/components/RoundedIconButton'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'
import ThemeTextInput from '@/components/ThemeTextInput'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/Button'

const ChangeName = () => {

  const { updateName, isLoading, error, user, setError, clearError } = useAuth()

  const [newName, setNewName] = React.useState("Artur Dierking");
  const [password, setPassword] = React.useState("123123");
  const [status, setStatus] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    clearError();
    if (!newName) {
      setError("Please enter your name");
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
    const response = await updateName(user?._id, newName, password.trim());
    if (!response.success) {
      setError(response.message);
    } else {
      setStatus("Changed Name!")
    }
    setNewName("");
    setPassword("");
  }

  return (
    <View className='w-full h-full bg-background p-5'>
      <SafeAreaView>
        <View className='flex-row pt-5 items-center justify-between'>
          <RoundedIconButton
            onPress={() => router.back()}
            icon={icons.back}
          />
          <Text className='font-rubik-semibold text-2xl max-w-[80%]'>Change Name</Text>
          <View className='w-9'></View>
        </View>
        <View className='pt-10'>

          <Text className='font-rubik-medium text-xl py-5'>Current Name: <Text className='font-rubik-light text-xl'>{user?.name}</Text></Text>

          <ThemeTextInput
            value={newName}
            onChangeText={setNewName}
            placeholder='Enter new name'
            title='Enter new name'
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
              disabled={!(newName.length >= 2 && newName.length <= 15)}
            />
          </View>
          <Text className='font-rubik-bold text-green-500 text-2xl text-center pt-5'>{status}</Text>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default ChangeName