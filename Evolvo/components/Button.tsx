import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'

const Button = ({ title, onPress, style, disabled }: ButtonProps) => {
  return (
    <TouchableOpacity
        onPress={disabled ? ()=>{} : onPress}
        key={1}
        className={`items-center ${ disabled ? "bg-accent/70" : `bg-accent` } py-4 px-20 rounded-full ${style}`}
    >
      <Text className='text-white text-xl'>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button