import { View, Text, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import timeAgo from '@/utils/formatter';
import clsx from 'clsx';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { colors } from '@/constants/theme';
import Button from './Button';
import { router } from 'expo-router';


const LectureCard = ({ title, icon, color, _id, lastLecture, type, onPress, expanded, shortTermQuestions, mediumTermQuestions, longTermQuestions, expandedDetails = false }: LectureCardProps) => {
    const animatedStyle = useAnimatedStyle(() => {
        return {
            maxHeight: expanded ? withTiming(300) : withTiming(0),
            opacity: withTiming(expanded ? 1 : 0),
        };
    });
    return (//className='lecture-card bg-card my-3'
        <Pressable onPress={onPress} className={clsx('lecture-card', 'my-3', expanded ? "lecture-card-expanded" : "bg-card")} style={!expanded && color ? {
            backgroundColor: expandedDetails ? colors.background : color
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
                    <Text className='lecture-info'>{shortTermQuestions + mediumTermQuestions + longTermQuestions} Questions</Text>
                    <Text className='lecture-last'>{lastLecture !== undefined ? timeAgo(new Date(lastLecture)) : ""}</Text>
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
                    <View className='items-center justify-center'>

                    </View>
                    <View className='w-full gap-2'>
                        <Button
                            title='Start Lecture'
                            onPress={() => { }}
                            style='bg-black'
                            fontStyle='text-white'
                        />
                        {expandedDetails && (
                            <Button
                                title='Show more Details'
                                onPress={() => router.navigate(`/lectures/${_id}`)}
                                style='bg-subscription border border-black'
                            />
                        )}
                    </View>
                </Animated.View>
            )}
        </Pressable>
    )
}

export default LectureCard