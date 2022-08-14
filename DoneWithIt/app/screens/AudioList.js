import React, { Component, useEffect } from "react";
import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import OptionModal from "../components/OptionModal";
import { Audio, InterruptionModeAndroid } from "expo-av";
import { pause, play, playNext, resume } from "../misc/audioPlayer";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      OptionModalVisible: false,
    };
    this.currentItem = {};
  }

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
  async handleAudioPress(audio) {
    const {
      soundObj,
      playbackObj,
      currentAudio,
      updateState,
      currentAudioTitle,
    } = this.context;
    console.log("Pressed on: ", audio.uri);
    //await Audio.setAudioModeAsync({ staysActiveInBackground: true });
    if (soundObj === null) {
      // if nothing is playing (first time)
      const playbackObj = new Audio.Sound();
      const status = await play(playbackObj, audio.uri);
      updateState(this.context, {
        playbackObj: playbackObj,
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioTitle: audio.filename,
      });
      return;
    }
    //pause audio
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      console.log("already playing");
      //audio is already playing
      const status = await pause(playbackObj);
      updateState(this.context, { soundObj: status, isPlaying: false });
      return;
    }

    //resume audio that was previously playing
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.id === audio.id
    ) {
      const status = await resume(playbackObj);
      updateState(this.context, { soundObj: status, isPlaying: true });
      return;
    }
    //play another audio
    if (
      //soundObj.isLoaded &&
      currentAudio.id !== audio.id
    ) {
      const status = await playNext(playbackObj, audio.uri);
      updateState(this.context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioTitle: audio.filename,
      });
    }
  }

  printTitles(x, y) {
    console.log(x, y);
    console.log(x === y);
    return x === y;
  }
  rowRenderer = (type, item, index, extendedState) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        isPlaying={extendedState.isPlaying}
        active={item.filename === this.context.currentAudioTitle}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.setState, OptionModalVisible: true });
        }}
        onAudioPress={() => this.handleAudioPress(item)}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider, isPlaying }) => {
          return (
            <View style={{ flex: 1 }}>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
                extendedState={{ isPlaying }}
              />
              <OptionModal
                currentItem={this.currentItem}
                visible={this.state.OptionModalVisible}
                onClose={() =>
                  this.setState({
                    ...this.state,
                    OptionModalVisible: false,
                  })
                }
              />
            </View>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  textFiles: {
    padding: 10,
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
});

export default AudioList;
