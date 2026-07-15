import { View, Text, Keyboard, TouchableWithoutFeedback } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import RoundedIconButton from '@/components/RoundedIconButton'
import { icons } from '@/constants/icons'
import { router } from 'expo-router'
import ThemeTextInput from '@/components/ThemeTextInput'
import { useAuth } from '@/context/AuthContext'
import Button from '@/components/Button'

const ChangePassword = () => {

  const { updatePassword, isLoading, error, user, setError, clearError } = useAuth()

  const [newPassword, setNewPassword] = React.useState("123123");
  const [conformPassword, setConfirmPassword] = React.useState("123123");
  const [password, setPassword] = React.useState("123123");
  const [status, setStatus] = React.useState<string | null>(null);

  const handleSubmit = async () => {
    clearError();
    if (newPassword !== conformPassword) {
      setError("You passwords don't match.")
      return;
    }
    if (!newPassword) {
      setError("Please enter your new Password");
      return;
    }
    if (newPassword.length < 6) {
      setError("New Password must be at least 6 characters long");
      return
    }
    if (!password.trim()) {
      setError("Please enter your password");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }
    const response = await updatePassword(user?._id, newPassword, password.trim());
    if (!response.success) {
      setError(response.message);
    } else {
      setStatus("Changed Password!")
    }
    setNewPassword("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <View className='w-full h-full bg-background p-5'>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <SafeAreaView>
          <View className='flex-row pt-5 items-center justify-between'>
            <RoundedIconButton
              onPress={() => router.back()}
              icon={icons.back}
            />
            <Text className='font-rubik-semibold text-2xl max-w-[80%]'>Change Password</Text>
            <View className='w-9'></View>
          </View>
          <View className='pt-10'>

            <ThemeTextInput
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder='Enter new password'
              title='Enter new password'
              type='visible-password'
              visible={false}
            />
            <ThemeTextInput
              value={conformPassword}
              onChangeText={setConfirmPassword}
              placeholder='Confirm password'
              title='confirm password'
              type='visible-password'
              visible={false}
            />
            <ThemeTextInput
              value={password}
              onChangeText={setPassword}
              placeholder='enter you password'
              title='Current Password'
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
                disabled={newPassword.length < 6}
              />
            </View>
            <Text className='font-rubik-bold text-green-500 text-2xl text-center pt-5'>{status}</Text>
          </View>
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </View>
  )
}

export default ChangePassword