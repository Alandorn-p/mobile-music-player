import { View, Text } from "react-native";

export default function App() {
  try {
    throw new Error("Exception message");
    return (
      <View
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Text style={{ backgroundColor: "red" }}>Your Text</Text>
      </View>
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
