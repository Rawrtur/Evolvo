import { View, Text } from 'react-native'
import React from 'react'
import Button from '@/components/Button'
import { useAuth } from '@/context/AuthContext'

const ChangePassword = () => {

  const { updatePassword, user } = useAuth();

  const handleUpdate = async () => {
    if (user)
      await updatePassword(user?._id, "123123", "123123")
  }

  return (
    <View>
      <Text>ChangePassword</Text>
      <Button title='change' onPress={handleUpdate} />
    </View>
  )
}

export default ChangePassword