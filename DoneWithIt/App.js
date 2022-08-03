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

export default function App() {
  let x = 1;
  console.log("app started");
  const pressStuff = () => console.log("pressed");
  const alertStuff = () => null;
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={{ backgroundColor: "dodgerblue", width: "50%", height: 80 }}
      ></View>
    </SafeAreaView>
  );
}

const containerStyle = { backgroundColor: "orange" };

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
});
