import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./app/navigation/AppNavigation";
import AudioProvider from "./app/context/AudioProvider";
import AudioListItem from "./app/components/AudioListItem";

import { View, Text } from "react-native";

import NotificationBanner from "./app/context/NotificationBanner";

import TestDownload from "./app/components/TestDownload";
import filenamify from "react-native-filenamify";

export default function App() {
  return (
    <AudioProvider>
      <NotificationBanner>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </NotificationBanner>
    </AudioProvider>
  );
}
