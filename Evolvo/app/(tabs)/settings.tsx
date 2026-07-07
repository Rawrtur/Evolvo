/* eslint-disable react-hooks/rules-of-hooks */
import { useAuth } from "@/context/AuthContext";
import "@/global.css"
import { View, Text, Alert, ScrollView, TouchableOpacity } from "react-native";
import { router } from 'expo-router'
import { SafeAreaView } from "react-native-safe-area-context";
import RoundedIconButton from "@/components/RoundedIconButton";
import { icons } from "@/constants/icons";
import LoadingScreen from "@/components/LoadingScreen";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/theme";
import { emailSettings, profileSettings } from "@/constants/data";

const SettingsNavigatorItem = ({ icon, text, route }: { icon: string, text: string, route: string }) => (
  <TouchableOpacity
    className="flex-row justify-between items-center"
    onPress={() => router.navigate(`/${route}`)}
  >
    <View className="flex-row items-center gap-3">
      <Ionicons name={icon} color={colors.accent} size={30} />
      <Text className="font-rubik-medium">{text}</Text>
    </View>
    <Ionicons name="chevron-forward" size={30} />
  </TouchableOpacity>
)


export default function settings() {

  const { logout, user, isLoading } = useAuth();

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

  if (isLoading) return <LoadingScreen />

  return (
    <View className='w-full h-full bg-background'>
      <SafeAreaView className="flex-1 h-full w-full items-center justify-center">
        <ScrollView className="p-5">
          <View className="flex-row items-center justify-between">
            <RoundedIconButton icon={icons.back} onPress={() => router.back()} />
            <Text className="font-rubik-bold text-accent text-2xl">Settings</Text>
            <View className="w-9" />
          </View>
          {user && user.role !== "Premium" && (
            <TouchableOpacity
              className="w-full rounded-3xl bg-accent h-[120px] mt-5 items-center justify-center"
              onPress={() => { }}
            >
              <Text className="font-rubik-bold text-white text-3xl">Become Premium</Text>
            </TouchableOpacity>
          )}
          <View className="w-full pt-5">
            <Text className="font-rubik-light text-gray-500">PROFILE</Text>
            <View className="w-full bg-white rounded-xl p-3 gap-5">
              {profileSettings.map((item, key) => <SettingsNavigatorItem key={key} {...item} />)}
            </View>
            <Text className="font-rubik-light text-gray-500 pt-5">NOTIFICATIONS</Text>
            <View className="w-full bg-white rounded-xl p-3 gap-5">
              {emailSettings.map((item, key) => <SettingsNavigatorItem key={key} {...item} />)}
            </View>
            <Text className="font-rubik-light text-gray-500 pt-5">TICKET SUPPORT</Text>
            <View className="w-full bg-white rounded-xl p-3 gap-5">
              <SettingsNavigatorItem route="Help" icon="ticket" text="Help"/>
            </View>
          </View>
          <View className="border-t border-accent mt-10 pt-5">
            <TouchableOpacity
              className="flex-row justify-between items-center"
              onPress={handleLogOut}
            >
              <View className="flex-row items-center gap-3">
                <Ionicons name={"log-out-outline"} color={colors.accent} size={30} />
                <Text className="font-rubik-medium">Log out</Text>
              </View>
              <Ionicons name="chevron-forward" size={30} />
            </TouchableOpacity>
          </View>
          <View className="h-40"/>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}