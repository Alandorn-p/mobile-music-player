import React from "react";
import { StyleSheet, View } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../misc/color";

const PlayerButton = (props) => {
  const { iconType, size = 40, iconColor = color.FONT, onPress } = props;
  const getIconName = (type) => {
    switch (type) {
      case "PLAY":
        return "pausecircle";
      case "PAUSE":
        return "playcircleo";
      case "NEXT":
        return "forward";
      case "PREVIOUS":
        return "banckward";
      default:
        return "antdesign";
    }
  };
  return (
    <AntDesign
      {...props}
      name={getIconName(iconType)}
      onPress={onPress}
      size={size}
      color={iconColor}
    />
  );
};

const styles = StyleSheet.create({});
export default PlayerButton;
