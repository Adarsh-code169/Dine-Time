import { Stack } from "expo-router";
import { NativeWindStyleSheet } from "nativewind";


import "../global.css";
// import { Text } from "react-native";
export default function RootLayout() {
  return (
  <Stack screenOptions={{headerShown: false}}>
    <Stack.Screen name = "index"/>
    <Stack.Screen name = "(tabs)"/>
  </Stack>
  )
};



