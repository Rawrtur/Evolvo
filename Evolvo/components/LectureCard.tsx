import { View, Text, Pressable, LayoutAnimation } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import timeAgo from '@/utils/formatter';
import clsx from 'clsx';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';


const LectureCard = ({ title, icon, color, _id, lastLecture, type, onPress, expanded, shortTermQuestions, mediumTermQuestions, longTermQuestions }: LectureCardProps) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            maxHeight: expanded ? withTiming(300) : withTiming(0),
            opacity: withTiming(expanded ? 1 : 0),
        };
    });
    return (//className='lecture-card bg-card my-3'
        <Pressable onPress={onPress} className={clsx('lecture-card', 'my-3', expanded ? "lecture-card-expanded" : "bg-card")} style={!expanded && color ? {
            backgroundColor: color
        } : undefined}>
            <View className='lecture-head'>
                <View className='lecture-main'>
                    <View className='lecture-icon items-center justify-center'>
                        <Ionicons
                            name={icon}
                            size={40}
                            color="black"
                        />
                    </View>
                    <View className='lecture-copy'>
                        <Text numberOfLines={1} className='lecture-title'>{title}</Text>
                        <Text numberOfLines={1} ellipsizeMode='tail' className='lecture-meta'>{type}</Text>
                    </View>
                </View>
                <View className='lecture-info-box'>
                    <Text className='lecture-info'>7 Questions</Text>
                    <Text className='lecture-last'>{timeAgo(lastLecture)}</Text>
                </View>
            </View>
            {expanded && (
                <Animated.View style={[animatedStyle]} className='lecture-body'>
                    <View className='lecture-details'>
                        <View className='lecture-row'>
                            <View className='lecture-row-copy'>
                                <Text className='lecture-label'>Short Period:</Text>
                                <Text className='lecture-value' numberOfLines={1} ellipsizeMode='tail'>{shortTermQuestions}</Text>
                            </View>
                        </View>
                        <View className='lecture-row'>
                            <View className='lecture-row-copy'>
                                <Text className='lecture-label'>Medium Period:</Text>
                                <Text className='lecture-value' numberOfLines={1} ellipsizeMode='tail'>{mediumTermQuestions}</Text>
                            </View>
                        </View>
                        <View className='lecture-row'>
                            <View className='lecture-row-copy'>
                                <Text className='lecture-label'>Long Period:</Text>
                                <Text className='lecture-value' numberOfLines={1} ellipsizeMode='tail'>{longTermQuestions}</Text>
                            </View>
                        </View>
                    </View>
                </Animated.View>
            )}
        </Pressable>
    )
}

export default LectureCard