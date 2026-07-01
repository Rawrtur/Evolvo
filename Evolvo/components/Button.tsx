import { Text, TouchableOpacity } from 'react-native'
import React from 'react'


const Button = ({ title, onPress, style, disabled, fontStyle, shadow=false }: ButtonProps) => {
  return (
    <TouchableOpacity
      onPress={disabled ? () => { } : onPress}
      key={1}
      activeOpacity={shadow ? 1 : 0.7}
      className={`items-center ${disabled ? "bg-accent/70" : `bg-accent`} py-4 px-20 rounded-full ${style} ${shadow ? "shadow-[0_8px_0_rgb(198_98_98),0_12px_20px_rgba(0,0,0,0.25)] hover:-translate-y-1 active:translate-y-[8px] active:shadow-[0_0px_0_rgb(198_98_98)] transitions-all duration-50" : ""}`}
      disabled={disabled}
    >
      <Text className={`${fontStyle} text-xl font-rubik`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button