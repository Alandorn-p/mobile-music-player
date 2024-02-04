import React from "react";
import { View, StyleSheet, Text, TouchableHighlight } from "react-native";
import color from "../misc/color";
import { AntDesign } from "@expo/vector-icons";

export default function PlaylistBanner({ onBackPress, onAddPress }) {
  return (
    <View style={styles.container}>
      <View style={styles.leftContainer}>
        <TouchableHighlight onPress={onBackPress}>
          <AntDesign name="back" size={24} color="black" />
        </TouchableHighlight>
      </View>
      <View style={styles.rightContainer}>
        <TouchableHighlight onPress={onAddPress}>
          <Text numberOfLines={1} style={styles.titleText}>
            {"Add more songs2"}
          </Text>
        </TouchableHighlight>
      </View>
    </View>
  );
}

// const rowWidth = 80;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    // alignSelf: "center",
    height: 50,
    //backgroundColor: "red",
  },
  leftContainer: {
    flex: 1,
    backgroundColor: color.RED,
    alignItems: "center",
    justifyContent: "center",
  },
  rightContainer: {
    backgroundColor: color.GREEN,
    flex: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  titleText: {
    fontSize: 16,
    color: color.FONT,
  },

  timeText: {
    fontSize: 12,
    color: color.FONT_LIGHT,
  },
});
