import type { ImageSourcePropType } from "react-native";

declare global {
  interface ButtonProps {
    title: string;
    onPress: () => void;
    style?: string;
    fontStyle?: string;
    disabled?: boolean;
    shadow?: boolean;
  }
  interface AddButtonProps {
    onPress: () => void;
    style?: string;
    size?:number;
  }
  interface Lecture {
    title: string;
    color?: string;
    icon: string;
    _id: string;
    type: "Theory" | "Practise" | "Calculate" | "Experiments" | "Projects";
    lastLecture: Date;
  }
  interface LectureCardProps {
    title: string;
    color?: string;
    icon: string;
    _id: string;
    type: "Theory" | "Practise" | "Calculate" | "Experiments" | "Projects";
    lastLecture: Date;
    onPress: () => void;
    expanded: boolean;
    shortTermQuestions: number;
    mediumTermQuestions: number;
    longTermQuestions: number;
    expandedDetails?: boolean;
  }
  interface Question {
    question: string;
    answer: string;
    state: string;
    lastAnswered: Date;
    lecture: string;
    _id: string;
  }
  interface DiscplayQuestion {
    question: string;
    answer: string;
    state: string;
    lastAnswered: Date;
    lecture: string;
    _id: string;
    points: 0;
  }
  interface User {
    __v: number;
    _id: string;
    createdAt: Date;
    email: string;
    name: string;
    password: string;
    updatedAt: Date;
    verficationCode: string | null;
    verificationExpiresIn: Date;
    verified: boolean;
    profilePicture: ImageSourcePropType;
    role: "Tester"| "Premium" | "Admin" | "User",
    streak: number;
    lastStreakDate: Date;
  }
  interface TabIconProbs {
    focused: boolean;
    icon: ImageSourcePropType;
  }
  interface ThemeTextInputProps {
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    title: string;
    lines?: number;
    type?: "default" | "numeric" | "email-address" | "visible-password";
    visible?: boolean;
  }
}

export {};
