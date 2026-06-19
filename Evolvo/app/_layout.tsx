import { SplashScreen, Stack } from "expo-router";
import "@/global.css"
import { useFonts } from "expo-font"
import { useEffect } from "react";
import { AuthProvider } from "@/context/AuthContext";
import { TouchableWithoutFeedback, View, Keyboard } from "react-native";

export default function RootLayout() {

  const [fontsLoaded] = useFonts({
    "rubik-regular": require("../assets/fonts/Rubik-Regular.ttf"),
    "rubik-semibold": require("../assets/fonts/Rubik-SemiBold.ttf"),
    "rubik-bold": require("../assets/fonts/Rubik-Bold.ttf"),
    "rubik-extrabold": require("../assets/fonts/Rubik-ExtraBold.ttf"),
    "rubik-light": require("../assets/fonts/Rubik-Light.ttf"),
    "rubik-medium": require("../assets/fonts/Rubik-Medium.ttf"),
  })

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded])

  if (!fontsLoaded) return null

  return (
    <AuthProvider>
      {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}

        <View className="w-full h-full bg-backgound">
          <Stack screenOptions={{ headerShown: false }} initialRouteName="(tabs)" />
        </View>
      {/* </TouchableWithoutFeedback> */}
    </AuthProvider>)
}
