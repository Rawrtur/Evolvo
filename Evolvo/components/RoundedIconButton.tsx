import { TouchableOpacity, Image, ImageSourcePropType } from 'react-native'
import React from 'react'

const RoundedIconButton = ({ onPress, icon }: { onPress: () => void, icon: ImageSourcePropType }) => {
    return (
        <TouchableOpacity
            onPress={onPress}
            className='rounded-full border-muted-foreground border p-1'
        >
            <Image source={icon} className='h-8 w-8' />
        </TouchableOpacity>
    )
}

export default RoundedIconButton