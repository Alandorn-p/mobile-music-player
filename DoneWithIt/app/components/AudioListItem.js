import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import React from "react";
import { Entypo } from "@expo/vector-icons";
import color from "../misc/color";

function secToMin(duration) {
  let sec = Math.round(duration % 60);
  sec = ("0" + sec.toString()).slice(-2);
  return `${Math.floor(duration / 60)}:${sec}`;
}

function thumbnailExtracter(text) {
  let thumbnail = (text.match(/[a-zA-Z]/) || []).pop();
  if (thumbnail === undefined || thumbnail === null) {
    return "#";
  }
  return thumbnail.toUpperCase();
}

const renderPlayPauseIcon = (isPlaying) => {
  if (isPlaying)
    return (
      <Entypo name="controller-play" size={24} color={color.ACTIVE_FONT} />
    );
  return <Entypo name="controller-paus" size={24} color="black" />;
};
export default function AudioListItem({
  title,
  duration,
  onAudioPress,
  onOptionPress,
  isPlaying,
  active,
}) {
  return (
    <View>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onAudioPress}>
          <View style={styles.leftContainer}>
            <View
              style={[
                styles.thumbnail,
                {
                  backgroundColor: active ? color.ACTIVE_BG : color.FONT_LIGHT,
                },
              ]}
            >
              <Text style={styles.thumbnailText}>
                {active
                  ? renderPlayPauseIcon(isPlaying)
                  : thumbnailExtracter(title)}
              </Text>
            </View>
            <View style={styles.titleContainer}>
              <Text numberOfLines={2} style={styles.titleText}>
                {title}
              </Text>
              <Text style={styles.timeText}>{secToMin(duration)}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={styles.rightContainer} onPress={onOptionPress}>
          <Entypo
            name="dots-three-vertical"
            size={25}
            color={color.FONT_MEDIUM}
            onPress={onOptionPress}
            style={{ padding: 10 }}
          />
        </View>
      </View>
      <View style={styles.seperatorView}></View>
    </View>
  );
}
const { width } = Dimensions.get("window");
const thumbnailHeight = 50;
// const sepHeight = thumbnailHeight * 0.1;

const rowWidth = width - 80;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: rowWidth,
    height: 50,
    //backgroundColor: "red",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    //backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    height: thumbnailHeight,
    flexBasis: 50,
    //backgroundColor: color.FONT_LIGHT,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 25,
  },
  thumbnailText: {
    fontSize: 22,
    fontWeight: "bold",
    color: color.FONT,
  },
  titleContainer: {
    width: width - 180,
    paddingLeft: 10,
  },
  titleText: {
    fontSize: 16,
    color: color.FONT,
  },
  seperatorView: {
    width: rowWidth,
    backgroundColor: "#333",
    opacity: 0.3,
    height: 0.5,
    //height: sepHeight,
    alignSelf: "center",
    marginTop: 10,
  },
  timeText: {
    fontSize: 12,
    color: color.FONT_LIGHT,
  },
});
