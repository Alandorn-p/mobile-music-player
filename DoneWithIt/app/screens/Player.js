import React from "react";
import { StyleSheet, Text, View } from "react-native";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";

function Player() {
  return (
    <View style={styles.container}>
      <Text style={styles.audioCount}>1/99</Text>
      <View style={styles.midBannerContainer}>
        <MaterialCommunityIcons name="music-circle" size={300} color="black" />
      </View>
      <View style={styles.audioPlayerContainer}>
        <Text numberOfLines={1} style={styles.audioTitle}>
          Audio name
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  audioTitle: {
    fontSize: 16,
    color: color.FONT,
  },
  audioCount: {
    textAlign: "right",
    padding: 15,
    color: color.FONT_LIGHT,
    fontsize: 14,
  },
  midBannerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioPlayerContainer: {},
});

export default Player;
