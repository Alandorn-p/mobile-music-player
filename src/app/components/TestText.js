import { View, Text } from "react-native";

export default function TestText() {
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
}
