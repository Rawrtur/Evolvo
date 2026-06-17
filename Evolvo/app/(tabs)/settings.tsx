/* eslint-disable react-hooks/rules-of-hooks */
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import "@/global.css"
import { View,Text, Alert } from "react-native";
import { router } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";


export default function settings() {

  const { logout, user } = useAuth();

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
    <View className='w-full h-full bg-background'>

      <SafeAreaView className="flex-1 h-full w-full items-center justify-center bg-white">
        <Text className="text-xl font-bold text-blue-500">
          Welcome to Nativewind!
        </Text>
        <Text>{user?.email || "mmm@mm.mm"}</Text>
        <Text>{user?.name || "User"}</Text>
        <Button title="Logout" onPress={handleLogOut} />
      </SafeAreaView>
    </View>
  );
}