import { View, Text, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import RoundedIconButton from '@/components/RoundedIconButton'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'
import { useAuth } from '@/context/AuthContext'
import ThemeTextInput from '@/components/ThemeTextInput'
import Button from '@/components/Button'

const Help = () => {

  const { clearError, setError, error, user, isLoading, submitProblem } = useAuth();

  const [text, setText] = React.useState("");
  const [status, setStatus] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    clearError();
    if (text.length < 15) {
      setError("Please discripe you problem in more detail");
      return;
    }
    const response = await submitProblem(user ? user._id : undefined, text);
    if (!response.success) {
      setError(response.message);
    } else {
      setStatus("Problem submitted successfully");
      setText("");
    }
  }

  return (
    <View className='w-full h-full bg-background'>
      <SafeAreaView className='flex-1 h-full w-full items-center justify-center'>
        <ScrollView className='p-5'>
          <View className="flex-row items-center justify-between">
            <RoundedIconButton icon={icons.back} onPress={() => router.back()} />
            <Text className="font-rubik-bold text-accent text-2xl">Help</Text>
            <View className="w-9" />
          </View>
          <Text className='font-rubik pt-5 text-center'>Please describe your problem in detail so that we can help you better.</Text>
          <View className='pt-10'>
            <ThemeTextInput
              value={text}
              onChangeText={setText}
              placeholder='please enter your problem'
              title='Enter your Problem:'
              lines={10}
            />
            <View className='py-10'>
              <Button
                title='Submit'
                onPress={handleSubmit}
                disabled={text.length < 15}
                shadow
                fontStyle='font-rubik-bold text-white'
              />
            </View>
          </View>
          <Text className='font-rubik-bold text-green-500 text-2xl text-center pt-5'>{status}</Text>

        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

export default Help