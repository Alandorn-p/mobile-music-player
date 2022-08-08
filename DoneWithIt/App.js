import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableWithoutFeedback,
  SafeAreaView,
  Alert,
  Button,
  Platform,
  StatusBar,
} from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import AppNavigation from "./app/navigation/AppNavigation";
import AudioProvider from "./app/context/AudioProvider";
import AudioListItem from "./app/components/AudioListItem";

export default function App() {
  return (
    <AudioProvider>
      <NavigationContainer>
        <AppNavigation />
      </NavigationContainer>
    </AudioProvider>
  );
}

const containerStyle = { backgroundColor: "orange" };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    //paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
