import { View, Text } from 'react-native'
import React from 'react'
import { useLocalSearchParams } from 'expo-router'

const LectureDetails = () => {

    const { id } = useLocalSearchParams();

    return (
        <View>
            <Text>LectureDetails for: {id}</Text>
        </View>
    )
}

export default LectureDetails