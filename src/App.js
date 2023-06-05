import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./app/navigation/AppNavigation";
import AudioProvider from "./app/context/AudioProvider";
import AudioListItem from "./app/components/AudioListItem";
import TestText from "./app/components/TestText";

import { View, Text } from "react-native";

import NotificationBanner from "./app/context/NotificationBanner";

import TestDownload from "./app/components/TestDownload";
import filenamify from "react-native-filenamify";

export default function App() {
  try {
    // return <TestText></TestText>;
    return (
      <AudioProvider>
        <NotificationBanner>
          <NavigationContainer>
            <AppNavigation />
          </NavigationContainer>
        </NotificationBanner>
      </AudioProvider>
    );
  } catch (e) {
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ backgroundColor: "red" }}>{e.message}</Text>
      </View>
    );
  }
}
