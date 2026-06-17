import { Text, TouchableOpacity, Image } from 'react-native'
import { icons } from '@/constants/icons'
import React from 'react'

const AddButton = ({ onPress, style }: AddButtonProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      key={1}
      className={`border rounded-full border-accent w-[40px] h-[40px] items-center justify-center ${style}`}
    >
      <Text className='text-4xl text-center text-accent'>
        <Image source={icons.add} />
      </Text>
    </TouchableOpacity>
  )
}

export default AddButton