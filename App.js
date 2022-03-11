import React from "react";
import BottomNavigator from "./components/BottomNavigator";
//adding new font
import { useFonts, Rajdhani_600SemiBold } from "@expo-google-fonts/rajdhani";

export default function App() {
  let [fontsLoaded] = useFonts({
    Rajdhani_600SemiBold,
  });

  if (fontsLoaded) {
    return <BottomNavigator />;
  }
  return null;
}
