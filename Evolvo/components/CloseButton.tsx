import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { icons } from '@/constants/icons'

const CloseButton = ({ onPress, style }: AddButtonProps) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            key={1}
            className={`rounded-full w-[40px] h-[40px] items-center justify-center ${style}`}
        >
            <Text className='text-4xl text-center text-accent'>
                <Image
                    source={icons.add}
                    style={{
                        width: 24,
                        height: 24,
                        transform: [{ rotate: '45deg' }],
                    }}
                />
            </Text>
        </TouchableOpacity>
    )
}

export default CloseButton