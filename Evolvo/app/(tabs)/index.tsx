import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import "@/global.css"
import { Text, View, Alert } from "react-native";
import { router } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";


export default function App() {

  const { isLoggedIn } = useAuth();

  if (!isLoggedIn) {
    router.replace("/(auth)/signin");
  }

  return (
    <SafeAreaView className="flex-1 items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
    </SafeAreaView>
  );
}