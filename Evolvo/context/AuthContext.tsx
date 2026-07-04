import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    deleteQuestion: (id: string) => Promise<({ success: boolean, message: string })>
    verified: string | null;
    logout: () => Promise<(void)>;
    error: string | null;
    isLoading: boolean;
    clearError: () => void;
    setError: (error: string) => void;
    PrevLanguage: string;
    setPrevLanguage: (lang: string) => void;
    createLecture: (title: string, color: string, icon: string, type: string, user: string) => Promise<({ success: boolean, message: string, lecture: object })>;
    isInSession: ()=>Promise<boolean>;
    setSessionState: React.Dispatch<React.SetStateAction<boolean>>;
    sessionState: boolean;
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
            const serialized = JSON.stringify(value);

            await AsyncStorage.setItem(String(key), serialized ?? null);
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
    }, [])


    const signIn = async (email: string, password: string) => {
        try {
            setError(null);
            setIsLoading(true);
            const response = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/v1/auth/sign-in`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });
            const data = await response.json();

            if (!response) {
                throw new Error(data.message || "Login Failed at line 123 AuthContext.tsx");
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

            setIsLoggedIn(true);

            return { success: true, message: "User logged in successfully" };
        } catch (error: any) {
            const errorMessage = error.message || "An Error occoured during login";
            setError(errorMessage);
            console.error("Login Error", error);
            return { success: false, message: errorMessage };
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

            const data = await response.json();

            if (!response) {
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
            const data = await response.json();

            if (!response) {
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

            setIsLoggedIn(true);

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
            const data = await response.json();

            if (!response) {
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, color, icon, type, user }),
            });
            const data = await response.json();

            if (!response) {
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
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();

            if (!response) {
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
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();

            if (!response) {
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ question, answer, lecture, user }),
            });
            const data = await response.json();

            if (!response) {
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
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();

            if (!response) {
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
                    sessionState
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