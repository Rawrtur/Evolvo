import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const SecondButton = ({ title, onPress, style, disabled, fontStyle }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={disabled ? () => { } : onPress}
      key={1}
      className={`items-center border border-accent justify-center px-2 py-1 rounded-full ${style}`}
    >
      <Text className={`${fontStyle} text-xl font-rubik`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default SecondButton