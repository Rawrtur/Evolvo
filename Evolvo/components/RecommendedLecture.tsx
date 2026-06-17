import { View, Text, Image } from 'react-native'
import React from 'react'
import timeAgo from '@/utils/formatter'
import { Ionicons } from '@expo/vector-icons';

const RecommendedLecture = ({ data: { title, color, icon, lastLecture } }: Lecture) => {
    return (
        <View className='recommended'>
            <View className='recommended-row'>
                <View className='recommended-icon'>
                    <Ionicons
                        name={icon}
                        size={40}
                        color="black"
                    />
                </View>
                <View>
                    <Text className='recommended-date'>Last lecture:</Text>
                    <Text className='recommeded-meta' numberOfLines={1}>{lastLecture ? timeAgo(new Date(lastLecture)) : ""}</Text>
                </View>
            </View>
            <Text className='recommended-name' numberOfLines={1}>{title}</Text>
        </View>
    )
}

export default RecommendedLecture