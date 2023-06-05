import React from "react";
import { StyleSheet, Text, View } from "react-native";

function PlayList() {
  return (
    <View style={styles.container}>
      <Text>Audio List</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default PlayList;
