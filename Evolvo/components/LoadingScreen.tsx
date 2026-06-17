import { View } from 'react-native'
import React from 'react'
import LottieView from 'lottie-react-native'

const LoadingScreen = () => {
    return (
        <View className='w-full h-full bg-background items-center justify-center'>
            <LottieView
                source={require('../assets/animations/loading.json')}
                autoPlay
                loop
                style={{ width: 300, height: 300 }}
            />
        </View>
    )
}

export default LoadingScreen