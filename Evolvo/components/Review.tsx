import { View, Text } from 'react-native'
import React, { useEffect } from 'react'
import { useAuth } from '@/context/AuthContext'
import LottieView from 'lottie-react-native';
import AnswerQuestion from './AnswerQuestion';
import LoadingScreen from './LoadingScreen';
import { getDaysAgo } from '@/utils/getAge';


const Review = ({ id, showHeader=true }: { id: String | string[], showHeader?:boolean }) => {

    const { questions, isLoading, updateQuestion } = useAuth();
    const [thisQuestions, setThisQuestions] = React.useState<DiscplayQuestion[]>([]);
    const [answeredQuestions, setAnsweresQuestions] = React.useState([])
    useEffect(() => {
        const currentQuestions = questions.filter(q => q.lecture === id && q.state !== "none" ).map(q => {
            let points = 0;
            if (q.lastAnswered) {
                const daysAgo = getDaysAgo(q.lastAnswered);
                switch (q.state) {
                    case "long":
                        if (daysAgo < 15) points = 1; 
                        break;
                    case "medium":
                        if (daysAgo < 5) points = 1; 
                        break;
                    case "short":
                        if (daysAgo < 1) points = 1; 
                        break;
                    case "none":
                        points = 1;
                        break
                    default:
                        break;
                }
            }

            return {
                question: q.question,
                answer: q.answer,
                state: q.state,
                lastAnswered: q.lastAnswered,
                lecture: q.lecture,
                _id: q._id,
                points
            }
        }).filter(q=> q.points === 0)
        setThisQuestions(currentQuestions);
    }, [questions])

    const handleAgain = () => {
        thisQuestions[0].points -= 1;
        let newList = [...thisQuestions.slice(1), thisQuestions[0]];
        setThisQuestions(newList);
    }

    const handleGood = async () => {
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
        await updateQuestion(thisQuestions[0]._id, thisQuestions[0].question, thisQuestions[0].answer, newState, new Date())
        let newList = [...thisQuestions.slice(1)];
        setAnsweresQuestions([...answeredQuestions, thisQuestions[0]._id])
        setThisQuestions(newList);
    }
    // "short", "long", "medium"
    const handleOnGood = async () => {
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
        await updateQuestion(thisQuestions[0]._id, thisQuestions[0].question, thisQuestions[0].answer, newState, new Date())
        let newList = [...thisQuestions.slice(1)];
        setAnsweresQuestions([...answeredQuestions, thisQuestions[0]._id])
        setThisQuestions(newList);
    }
    if (isLoading) {
        return (
            <LoadingScreen />
        )
    }

    return (
        <View className="w-full p-5">
            {showHeader && (<View className="items-center justify-center w-full">
                <Text className="bg-accent text-white py-3 px-10 text-2xl font-rubik-medium rounded-full">Review</Text>
                <Text className="font-rubik text-center pt-5">Time to review you questions</Text>
            </View>)}
            <View>
                {thisQuestions.length === 0 ? (
                    <View className='w-full items-center justify-center'>
                        <LottieView
                            source={require("../assets/animations/jump.json")}
                            autoPlay
                            loop
                            style={{ width: 300, height: 300 }}
                        />
                        <Text className="font-rubik-bold text-2xl text-center py-5">You did it!</Text>
                    </View>
                ) : (
                    <AnswerQuestion
                        question={thisQuestions[0].question}
                        answer={thisQuestions[0].answer}
                        onGood={handleGood}
                        onVeryGood={handleOnGood}
                        onAgain={handleAgain}
                        id={thisQuestions[0]._id}
                        state={thisQuestions[0].state}
                        lastAnswered={thisQuestions[0].lastAnswered}
                    />
                )}

            </View>
        </View>
    )
}

export default Review