import React, { useContext } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import color from "../misc/color";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Slider from "@react-native-community/slider";
import PlayerButton from "../components/PlayerButton";
import { AudioContext } from "../context/AudioProvider";

const { width } = Dimensions.get("window");

function Player() {
  const context = useContext(AudioContext);
  const { playbackDur, playbackPos } = context;
  const calcSeekBar = () => {
    if (playbackPos !== null && playbackDur !== null) {
      return playbackPos / playbackDur;
    }
    return 0;
  };
  return (
    <View style={styles.container}>
      {/* <Text style={styles.audioCount}>1/</Text> */}

      <View style={styles.midBannerContainer}>
        <MaterialCommunityIcons
          name="music-circle"
          size={300}
          color={context.isPlaying ? color.ACTIVE_BG : color.FONT_MEDIUM}
        />
      </View>
      <View style={styles.audioPlayerContainer}>
        <Text numberOfLines={1} style={styles.audioTitle}>
          {context.currentAudio === null
            ? "None Playing"
            : context.currentAudio.filename}
          {/* audio name */}
        </Text>
        <Slider
          style={{ width: width, height: 40 }}
          minimumValue={0}
          maximumValue={1}
          value={calcSeekBar()}
          minimumTrackTintColor={color.FONT_MEDIUM}
          maximumTrackTintColor="gray"
        />
        <View style={styles.audioIcons}>
          <PlayerButton iconType="PREVIOUS" />
          <PlayerButton
            style={{ marginHorizontal: 25 }}
            onPress={() => 1}
            iconType={context.isPlaying ? "PLAY" : "PAUSE"}
          />
          <PlayerButton iconType="NEXT" />
        </View>
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
  audioPlayerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  audioIcons: {
    width,
    paddingBottom: 25,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Player;
