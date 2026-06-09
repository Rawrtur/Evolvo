import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const AddButton = ({ onPress, style}: AddButtonProps) => {
  return (
    <TouchableOpacity
        onPress={onPress}
        key={1}
        className={`border rounded-full border-accent w-[40px] h-[40px] items-center justify-center ${style}`}
    >
      <Text className='text-4xl text-center text-accent'>+</Text>
    </TouchableOpacity>
  )
}

export default AddButton