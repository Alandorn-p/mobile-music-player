import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./app/navigation/AppNavigation";
import AudioProvider from "./app/context/AudioProvider";
import AudioListItem from "./app/components/AudioListItem";
import TestText from "./app/components/TestText";
import { View, Text } from "react-native";

import NotificationBanner from "./app/context/NotificationBanner";

import TestDownload from "./app/components/TestDownload";
import filenamify from "react-native-filenamify";
import { defaultIpAddress, defaultPort } from "./app/misc/constants";
import { React, useState } from "react";

import { ipContext } from "./app/context/configContexts";

export default function App() {
  const [ipAddress, setIpAddress] = useState(defaultIpAddress);
  const [port, setPort] = useState(defaultPort);

  const value = { ipAddress, setIpAddress, port, setPort };
  try {
    // return <TestText></TestText>;
    return (
      <ipContext.Provider value={value}>
        <AudioProvider>
          <NotificationBanner>
            <NavigationContainer>
              <AppNavigation />
            </NavigationContainer>
          </NotificationBanner>
        </AudioProvider>
      </ipContext.Provider>
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
