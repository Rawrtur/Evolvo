import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import { router } from 'expo-router';
import LottieView from 'lottie-react-native';
import AnswerQuestion from './AnswerQuestion';
import Button from './Button';


const Review = ({ id }: { id: String | string[] }) => {

    const { questions, isLoading, updateQuestion } = useAuth();
    const [thisQuestions, setThisQuestions] = React.useState(questions.filter(q => q.lecture === id).map(q => {
        return {
            question: q.question,
            answer: q.answer,
            state: q.state,
            lastAnswered: q.lastAnswered,
            lecture: q.lecture,
            _id: q._id,
            points: 0
        }
    }));

    const handleAgain = () => {
        thisQuestions[0].points -= 1;
        let newList = [...thisQuestions.slice(1), thisQuestions[0]];
        setThisQuestions(newList);
    }

    const handleGood = async() => {
        let newState = "long"
        switch (thisQuestions[0].state) {
            case "medium":
                if (thisQuestions[0].points < 0) {
                    newState = "short";
                } else {
                    newState = "medium"
                }
                break;
            case "short":
                if (thisQuestions[0].points < 0) {
                    newState = "short";
                } else {
                    newState = "short"
                }
                break;
            case "long":
                if (thisQuestions[0].points < 0) {
                    newState = "medium";
                } else {
                    newState = "long"
                }
                break;
            default:
                break;
        }
        await updateQuestion(thisQuestions[0]._id, thisQuestions[0].question, thisQuestions[0].answer, newState)
        let newList = [...thisQuestions.slice(1)];
        setThisQuestions(newList);
    }
    // "short", "long", "medium"
    const handleOnGood = async() => {
        let newState = "long";
        switch (thisQuestions[0].state) {
            case "medium":
                if (thisQuestions[0].points < 0) {
                    newState = "medium";
                } else {
                    newState = "long"
                }
                break;
            case "short":
                if (thisQuestions[0].points < 0) {
                    newState = "short";
                } else {
                    newState = "medium"
                }
                break;
            default:
                break;
        }
        await updateQuestion(thisQuestions[0]._id, thisQuestions[0].question, thisQuestions[0].answer, newState)
        let newList = [...thisQuestions.slice(1)];
        setThisQuestions(newList);
    }

    return (
        <View className="w-full p-5">
            <View className="items-center justify-center w-full">
                <Text className="bg-accent text-white py-3 px-10 text-2xl font-rubik-medium rounded-full">Review</Text>
                <Text className="font-rubik text-center pt-5">Time to review you questions</Text>
            </View>
            <View>
                {thisQuestions.length === 0 ? (
                    <View>
                        <LottieView
                            source={require("../assets/animations/jump.json")}
                            autoPlay
                            loop
                            style={{ width: 300, height: 300 }}
                        />
                        <Text className="font-rubik-bold text-2xl">You did it!</Text>
                        <Button title="Finish Lection" onPress={() => { }} style='bg-black' fontStyle='font-rubik-bold text-white' />
                    </View>
                ) : (
                    <AnswerQuestion
                        question={thisQuestions[0].question}
                        answer={thisQuestions[0].answer}
                        onGood={handleGood}
                        onVeryGood={handleOnGood}
                        onAgain={handleAgain}
                    />
                )}

            </View>
        </View>
    )
}

export default Review