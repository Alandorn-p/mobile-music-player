import React, { Component } from "react";
import { Button, Dimensions, StyleSheet, View } from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import OptionModal from "../components/OptionModal";
import { Audio, InterruptionModeAndroid } from "expo-av";
import { pause, play, playNext, resume } from "../misc/audioPlayer";
import AudioSelectItem from "./AudioSelectItem";
import color from "../misc/color";
import PlaylistBanner from "./PlaylistBanner";

export default class SongSelector extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      songSelected: new Set(),
    };
    this.currentItem = {};
  }

  confirmSongSelection = () => {
    console.log(this.state.songSelected);
  };

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = dim.height = 0;
      }
    }
  );

  toggleSongSelected = (item) => {
    const set = this.state.songSelected;
    if (set.has(item.filename)) {
      set.delete(item.filename);
    } else {
      set.add(item.filename);
    }
    this.setState({ ...this.state, songSelected: set });
  };

  rowRenderer = (type, item, index, extendedState) => {
    // console.log("ITEM IS: ", item);
    return (
      <AudioSelectItem
        title={item.filename}
        duration={item.duration}
        selected={extendedState.songSelected.has(item.filename)}
        onPress={() => this.toggleSongSelected(item)}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, testState }) => {
          return (
            <>
              {/* <Button
                title={`Confirm ${this.state.songSelected.size} songs`}
                color={color.GREEN}
                onPress={this.confirmSongSelection}
              /> */}
              <PlaylistBanner
                onBackPress={() => {
                  console.log("pressing back");
                  testState();
                }}
                onAddPress={() => {
                  console.log("pressing back");
                  testState();
                }}
              ></PlaylistBanner>
              <View style={{ flex: 1 }}>
                {/* <Button title="hi" onPress={getAudioFiles} /> */}
                <RecyclerListView
                  dataProvider={dataProvider}
                  layoutProvider={this.layoutProvider}
                  rowRenderer={this.rowRenderer}
                  extendedState={this.state}
                />
              </View>
            </>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
