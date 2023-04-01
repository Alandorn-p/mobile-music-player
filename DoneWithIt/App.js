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
    // <>
    //   <View style={{ flex: 1 }}>
    //     <TestDownload />
    //   </View>
    //   <Text fontsize={200}>
    //     {filenamify(
    //       "Otonari no Tenshi-sama ED / Ending Full 『Chiisana Koi no Uta』 by" +
    //         "Manaka Iwami"
    //     )}
    //   </Text>
    // </>
    <AudioProvider>
      <NotificationBanner>
        <NavigationContainer>
          <AppNavigation />
        </NavigationContainer>
      </NotificationBanner>
    </AudioProvider>
  );
}
