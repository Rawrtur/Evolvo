import type { ImageSourcePropType } from "react-native";

declare global {
  interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: string;
    disabled?: boolean;
  }
  interface AddButtonProps {
    onPress: () => void;
    style?: string;
  }
  interface Lecture {
    title: string;
    color?: string;
    icon: ImageSourcePropType;
    _id: string;
    lastLecture: Date;
  }
  interface Question {
    question: string;
    answer: string;
    state: string;
    lastAnswered: Date;
    _id: string;
  }
  interface User {
    __v: number;
    _id: string;
    createdAt: Date,
    email: string;
    name: string;
    password: string;
    updatedAt: Date;
    verficationCode: string|null;
    verificationExpiresIn: Date;
    verified: boolean;  
    profilePicture: ImageSourcePropType;
  }
  interface TabIconProbs {
    focused: boolean;
    icon: ImageSourcePropType;
  }
}

export {};
