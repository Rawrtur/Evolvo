/* eslint-disable react-hooks/rules-of-hooks */
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import "@/global.css"
import { Text, View, Alert } from "react-native";
import { router } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";


export default function settings() {

  const { logout } = useAuth();

  const handleLogOut = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => { },
          style: 'cancel'
        },
        {
          text: 'Logout',
          onPress: async () => {
            await logout()
            router.replace('/(auth)/signin')
          },
          style: 'destructive'
        }
      ]
    )
  }

  return (
    <SafeAreaView className="flex-1 h-full w-full items-center justify-center bg-white">
      <Text className="text-xl font-bold text-blue-500">
        Welcome to Nativewind!
      </Text>
      <Button title="Logout" onPress={handleLogOut} />
    </SafeAreaView>
  );
}