import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";
import { Text, ScrollView, View, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import Button from "@/components/Button";

export interface AuthContextType {
    isLoggedIn: boolean;
    user: User | null;
    lectures: Lecture[];
    questions: Question[];
    token: string | null;
    signIn: (email: string, password: string) => Promise<({ success: boolean, message: string })>;
    signUp: (name: string, email: string, password: string) => Promise<({ success: boolean, message: string })>;
    verify: (email: string, code: string) => Promise<({ success: boolean, message: string })>;
    resendVerify: (email: string) => Promise<({ success: boolean, message: string })>;
    getLectureDetails: (id: string) => Promise<({ success: boolean, message: string, data: object })>;
    deleteLecture: (id: string) => Promise<({ success: boolean, message: string })>;
    createQuestion: (question: string, answer: string, lecture: string, user: string) => Promise<({ success: boolean, message: string })>
    deleteQuestion: (id: string) => Promise<({ success: boolean, message: string })>;
    updateQuestion: (id: string, question: string, answer: string, state: string, lastAnswered: Date) => Promise<({ success: boolean, message: string })>
    verified: string | null;
    logout: () => Promise<(void)>;
    error: string | null;
    isLoading: boolean;
    clearError: () => void;
    setError: (error: string) => void;
    PrevLanguage: string;
    setPrevLanguage: (lang: string) => void;
    createLecture: (title: string, color: string, icon: string, type: string, user: string) => Promise<({ success: boolean, message: string, lecture: object })>;
    isInSession: () => Promise<boolean>;
    setSessionState: React.Dispatch<React.SetStateAction<boolean>>;
    sessionState: boolean;
    commitLecture: (id: string) => Promise<({ success: true, message: string })>;
    updatePassword: (id: string, newPassword: string, password: string) => Promise<({ success: boolean, message: string })>;
    updateEmail: (id: string, newEmail: string, password: string) => Promise<({ success: boolean, message: string })>;
    updateName: (id: string, newName: string, password: string) => Promise<({ success: boolean, message: string })>;
    submitProblem: (user: string | undefined, problem: string) => Promise<({ success: boolean, message: string })>;
    generateQuestions: (topic:string) => Promise<({success:boolean, message:string})>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const safeAsyncStorage = {
    getItem: async (key: string): Promise<string | null> => {
        try {
            const raw = await AsyncStorage.getItem(key);
            if (key === "authToken") {
                return raw; // Return token as is (string or null)
            }
            return raw ? JSON.parse(raw) : null;
        } catch (error) {
            if (error instanceof Error && error.message.includes("Native module is null")) {
                return null;
            }
            console.warn('AsyncStorage getItem failed, using fallback:', error);
            return null;
        }
    },
    setItem: async (key: string, value: string): Promise<void> => {
        try {
            if (key === "authToken") {
                await AsyncStorage.setItem(String(key), value);

            } else {
                const serialized = JSON.stringify(value);
                await AsyncStorage.setItem(String(key), serialized ?? null);
            }
        } catch (error) {
            if (error instanceof Error && error.message.includes("Native module is null")) {
                return;
            }
            console.warn('AsyncStorage getItem failed, using fallback:', error);
            return;
        }
    },
    removeItem: async (key: string): Promise<void> => {
        try {
            await AsyncStorage.removeItem(key);
        } catch (error) {
            console.warn('AsyncStorage removeItem failed, using fallback:', error);
        }
    }
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [lectures, setLectures] = useState<Lecture[]>([]);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [token, setToken] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [PrevLanguage, setPrevLanguage] = useState<string>("en");
    const [verified, setVerified] = useState<string | null>(null);
    const [sessionState, setSessionState] = useState(false);
    const [connected, setConnected] = useState(false);

    // backend status prüfen
    async function isBackendRechable() {
        // setIsLoading(true);
        const controller = new AbortController();

        const timeout = setTimeout(() => {
            controller.abort();
        }, 5000)

        setIsLoading(true);
        try {
            // console.log(1)
            // console.log(process.env.EXPO_PUBLIC_API_URL)
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/health`, {
                signal: controller.signal,
            });

            if (response.ok) setConnected(true)
        } catch (error) {
            console.log(error);
            setConnected(false);
        } finally {
            clearTimeout(timeout)
            setIsLoading(false)
            // setIsLoading(false)
        }
    }

    useEffect(() => {
        const initializeAuth = async () => {
            try {

                // Small delay to ensure AsyncStorage is ready
                await new Promise(resolve => setTimeout(resolve, 500));

                const storedToken = await safeAsyncStorage.getItem("authToken");
                const storedUser = await safeAsyncStorage.getItem("user");
                const storedLang = await safeAsyncStorage.getItem("lang");
                const storedVerify = await safeAsyncStorage.getItem("verified");

                if (storedVerify) {
                    setVerified(storedVerify);
                }
                if (!connected) await isBackendRechable();

                if (storedToken && storedUser) {
                    setToken(storedToken);
                    setUser(storedUser);
                    setIsLoggedIn(true);

                    if (storedLang) {
                        setPrevLanguage(storedLang);
                    }
                    let response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/lectures/user/${storedUser._id}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    let data = await response.json();

                    if (!response) {
                        throw new Error(data.message || "Login Failed at line 123 AuthContext.tsx");
                    }

                    if (data.error) {
                        setError(data.error);
                        return { success: false, message: data.error }
                    }
                    const { lectures } = data.data;
                    setLectures(lectures)

                    response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/questions/user/${storedUser._id}`, {
                        method: 'GET',
                        headers: { 'Content-Type': 'application/json' },
                    });
                    data = await response.json();

                    if (!response) {
                        throw new Error(data.message || "Login Failed at line 130 AuthContext.tsx");
                    }

                    if (data.error) {
                        setError(data.error);
                        return { success: false, message: data.error }
                    }
                    const { questions } = data;
                    setQuestions(questions)
                }

            } catch (error) {
                console.error("Error initializing auth: ", error)
            } finally {
                setIsLoading(false);
            }
        };
        initializeAuth();
    }, [connected])


    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/sign-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });


            if (response.status === 429) {
                setError("Reached Rate Limit")
                return { success: false, message: "Reached Rate Limit" }
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Login Failed at line 204 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            const { token, user, lectures, questions } = data.data;

            await safeAsyncStorage.setItem("authToken", token);
            await safeAsyncStorage.setItem("user", user);
            await safeAsyncStorage.setItem("lectures", lectures);
            await safeAsyncStorage.setItem("questions", questions);


            setToken(token);
            setUser(user);
            setLectures(lectures);
            setQuestions(questions);

            setIsLoggedIn(true);

            return { success: true, message: "User logged in successfully" };
        } catch (error: any) {
            if (error instanceof TypeError) {
                // fetch konnte keine Verbindung herstellen
                setConnected(false);
            } else {
                setError(error.message);
            }

            return { success: false, message: error.message };
        } finally {
            setIsLoading(false);
        }
    }


    const signUp = async (name: string, email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/sign-up`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            });

            if (response.status === 429) {
                setError("Reached Rate Limit")
                return { success: false, message: "Reached Rate Limit" }
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "SignUp Failed at line 166 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            await safeAsyncStorage.setItem("verified", email);

            return data;

        } catch (error: any) {
            const errorMessage = error.message || "An Error occoured during sign up.";
            setError(errorMessage);
            console.error("Sign up Error: ", error);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }

    const verify = async (email: string, code: string) => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, code }),
            });

            if (response.status === 429) {
                setError("Reached Rate Limit")
                return { success: false, message: "Reached Rate Limit" }
            }

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "verification Failed at line 212 AuthContext.tsx");
            }
            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            const { token, user, lectures, questions } = data.data;
            await safeAsyncStorage.setItem("authToken", token);
            await safeAsyncStorage.setItem("user", user);
            await safeAsyncStorage.setItem("lectures", lectures);
            await safeAsyncStorage.setItem("quesions", questions);

            setToken(token);
            setUser(user);
            setLectures(lectures);
            setQuestions(questions);

            setIsLoggedIn(true);
            await safeAsyncStorage.removeItem("verified")
            return { success: true, message: data.message };
        } catch (error: any) {
            const errorMessage = error.message || "An Error occoured during Verification.";
            setError(errorMessage);
            console.error("Sign up Error: ", error);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }

    const resendVerify = async (email: string) => {
        try {
            setError(null);
            setIsLoading(true);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/resend-verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            if (response.status === 429) {
                setError("Reached Rate Limit")
                return { success: false, message: "Reached Rate Limit" }
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Resend Failed at line 253 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            return data;

        } catch (error: any) {
            const errorMessage = error.message || "An Error occoured during Verification.";
            setError(errorMessage);
            console.error("Sign up Error: ", error);
            return { success: false, message: errorMessage };
        } finally {
            setIsLoading(false);
        }
    }


    const logout = async () => {
        try {
            setIsLoading(true);

            await safeAsyncStorage.removeItem("authToken");
            await safeAsyncStorage.removeItem("user");
            await safeAsyncStorage.removeItem("lectures");
            await safeAsyncStorage.removeItem("questions");
            // router.replace("/(auth)")

            setToken(null);
            setUser(null);
            setLectures([]);
            setQuestions([]);
            setIsLoggedIn(false);
            setError(null)

        } catch (error) {
            console.error("Logout error:", error);
        } finally {
            setIsLoading(false);
        }
    }


    const clearError = () => setError(null);

    const createLecture = async (title: string, color: string, icon: string, type: string, user: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/lectures`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ title, color, icon, type, user }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Resend Failed at line 314 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            setLectures((prev) => [...prev, data.lecture])

            return data;

        } catch (error) {
            console.error("Error while creating Lecture: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const getLectureDetails = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/lectures/${id}`, {
                method: 'GET',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Resend Failed at line 314 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            return data;


        } catch (error) {
            console.error("Error while fetching LectureDetails: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const deleteLecture = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/lectures/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Resend Failed at line 314 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            setLectures(lectures.filter(lec => lec._id !== id)) // Anzeige updaten

            return data;

        } catch (error) {
            console.error("Error while deleting Lecture: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const createQuestion = async (question: string, answer: string, lecture: string, user: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/questions`, {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ question, answer, lecture, user }),
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Resend Failed at line 417 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            setQuestions((prev) => [...prev, data.question])

            return data;

        } catch (error) {
            console.error("Error while creating question: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const deleteQuestion = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/questions/${id}`, {
                method: 'DELETE',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Resend Failed at line 314 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            setQuestions(questions.filter(ques => ques._id !== id)) // Anzeige updaten

            return data;

        } catch (error) {
            console.error("Error while deleting Question: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const isInSession = async () => {
        const value = await AsyncStorage.getItem("timerValue");
        return (value !== null);
    }

    const updateQuestion = async (id: string, question: string, answer: string, state: string, lastAnswered: Date) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/questions/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ question, answer, state, lastAnswered })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Resend Failed at line 506 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            setQuestions([...questions.filter(q => q._id !== id), data.updatedQuestion]) // Anzeige updaten

            return data;

        } catch (error) {
            console.error("Error while updating Question: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const commitLecture = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null)

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/lectures/${id}`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                // body: JSON.stringify({ question, answer, state, lastAnswered })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Resend Failed at line 538 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            setLectures([...lectures.filter(l => l._id !== id), data.lecture])

            return data;
        } catch (error) {
            console.error("Error while commiting Lecture: ", error);
        } finally {
            setIsLoading(false);
        }
    }

    const updatePassword = async (id: string, newPassword: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null)

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/users/password/me`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ newPassword, password })
            });
            const data = await response.json();

            if (!response.ok) {
                if (data.error !== "Current Password is incorrect") {
                    throw new Error(data.message || "Update Failed at line 652 AuthContext.tsx");
                } else {
                    return { success: false, message: data.error }
                }
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }
            return data;

        } catch (error) {
            await logout();
        } finally {
            setIsLoading(false);
        }
    }

    const updateEmail = async (id: string, newEmail: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null)

            if (user?.email === newEmail) return { success: true, message: "successfully" }

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/users/email/me`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ newEmail, password })
            });
            const data = await response.json();
            if (!response.ok) {
                if (data.error !== "Current Password is incorrect") {
                    throw new Error(data.message || "Update Failed at line 625 AuthContext.tsx");
                } else {
                    return { success: false, message: data.error }
                }
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            setUser({ ...user, email: newEmail })
            await safeAsyncStorage.setItem("user", { ...user, email: newEmail })

            await safeAsyncStorage.setItem("verified", newEmail);
            setVerified(newEmail)
            router.replace("/(sites)/verify")



            return { success: true, message: "send to verify" }

        } catch (error) {
            console.log(error)
            await logout();

        } finally {
            setIsLoading(false);
        }
    }

    const updateName = async (id: string, newName: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null)

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/users/name/me`, {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({ newName, password })
            });
            const data = await response.json();

            if (!response.ok) {
                if (data.error !== "Current Password is incorrect") {
                    throw new Error(data.message || "Update Failed at line 729 AuthContext.tsx");
                } else {
                    return { success: false, message: data.error }
                }
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            setUser({ ...user, name: newName })
            await safeAsyncStorage.setItem("user", { ...user, name: newName })
            return {success:true, message: "Updatet Name successfully"}

        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }

    const submitProblem = async (user: string | undefined, problem: string) => {
        try {
            setError(null)
            setIsLoading(true);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/support`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ user, problem })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Resend Failed at line 771 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error }
            }

            return { success: true, message: data.message }

        } catch (error) {
            console.error("Error while Submit Problem: ", error);

        } finally {
            setIsLoading(false)
        }
    }

    const generateQuestions = async (topic: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/ai/questions`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ topic, user })
            });
            const data = await response.json();

            if (!response.ok) {
                setError(data.message)
                throw new Error(data.message || "Resend Failed at line 802 AuthContext.tsx");
            }

            if (data.error) {
                setError(data.error);
                return { success: false, message: data.error };
            }

            return data;

        } catch (error:any) {
            console.error(error)
        } finally {
            setIsLoading(false);
        }
    }

    if (!connected && !isLoading) return (
        <SafeAreaView className="w-full h-screen bg-background items-center justify-center">
            <View className="h-50" />
            <View className="w-full items-center justify-center pb-10">
                <LottieView
                    source={require('../assets/animations/sleep.json')}
                    autoPlay
                    loop
                    style={{ width: 300, height: 300 }}
                />
                <Text className="font-rubik-bold text-center text-accent">Server not available</Text>
                <Button title="Try Again" onPress={isBackendRechable} shadow fontStyle="font-rubik-bold text-white" />
            </View>

        </SafeAreaView>
    )

    return (
        <AuthContext.Provider
            value={
                {
                    isLoggedIn,
                    user,
                    lectures,
                    questions,
                    token,
                    signIn,
                    signUp,
                    logout,
                    verify,
                    resendVerify,
                    getLectureDetails,
                    deleteLecture,
                    createQuestion,
                    deleteQuestion,
                    updateQuestion,
                    verified,
                    error,
                    isLoading,
                    clearError,
                    setError,
                    PrevLanguage,
                    setPrevLanguage,
                    createLecture,
                    isInSession,
                    setSessionState,
                    sessionState,
                    commitLecture,
                    updatePassword,
                    updateEmail,
                    updateName,
                    submitProblem,
                    generateQuestions
                }
            }
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}