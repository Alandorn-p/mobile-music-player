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
      curSongIndex: 0,
      randomSongList: null,
      repeatSong: false,
    };
    this.currentItem = {};
  }

  randomListGen = (len) => {
    alist = Array.from(Array(len).keys());
    for (let i = alist.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = alist[i];
      alist[i] = alist[j];
      alist[j] = temp;
    }
    // console.log(alist);
    return alist;
  };

  resetRandomPlaylist(audio) {
    const { audioFiles } = this.context;
    const lst = this.randomListGen(this.context.audioFiles.length);
    if (audio !== null) {
      const ind = audioFiles.indexOf(audio);
      const ind_in_lst = lst.indexOf(ind);
      //swap
      [lst[0], lst[ind_in_lst]] = [lst[ind_in_lst], lst[0]];
    }
    this.setState({
      ...this.setState,
      randomSongList: lst,
      curSongIndex: 0,
    });
  }

  _onPlaybackStatusUpdate = async (playbackStatus) => {
    const { updateState, audioFiles, playbackObj } = this.context;
    if (!playbackStatus.isLoaded) {
      // Update your UI for the unloaded state
      if (playbackStatus.error) {
        console.log(
          `Encountered a fatal error during playback: ${playbackStatus.error}`
        );
        // Send Expo team the error on Slack or the forums so we can help you debug!
      }
    } else {
      // Update your UI for the loaded state

      if (playbackStatus.isPlaying) {
        this.context.updateState(this.context, {
          playbackPos: playbackStatus.positionMillis,
          playbackDur: playbackStatus.durationMillis,
        });
        // Update your UI for the playing state
      } else {
        // Update your UI for the paused state
      }

      if (playbackStatus.isBuffering) {
        // Update your UI for the buffering state
      }

      if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
        // The player has just finished playing and will stop. Maybe you want to play something else?
        console.log("finished playing");
        let nextSongIndex = this.state.repeatSong
          ? this.state.curSongIndex
          : this.state.curSongIndex + 1;
        if (nextSongIndex === audioFiles.length) {
          this.resetRandomPlaylist(null);
        } else {
          this.setState({ ...this.setState, curSongIndex: nextSongIndex });
        }

        let audio =
          audioFiles[this.state.randomSongList[this.state.curSongIndex]];
        // console.log(playbackObj);
        const status = await playNext(playbackObj, audio.uri);
        updateState(this.context, {
          soundObj: status,
          currentAudio: audio,
          isPlaying: true,
          currentAudioTitle: audio.filename,
        });
      }
    }
  };
  async handleAudioPress(audio) {
    const {
      soundObj,
      playbackObj,
      currentAudio,
      updateState,
      currentAudioTitle,
    } = this.context;
    console.log("Pressed on: ", audio.uri);

    if (soundObj === null) {
      // if nothing is playing (first time)
      const playbackObj = new Audio.Sound();
      this.resetRandomPlaylist(audio);

      const status = await play(playbackObj, audio.uri);
      updateState(this.context, {
        playbackObj,
        soundObj: status,
        currentAudio: audio,
        currentAudioTitle: audio.filename,
        isPlaying: true,
      });
      playbackObj.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
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
      this.resetRandomPlaylist(audio);
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
  componentDidMount() {
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      //playThroughEarpieceAndroid: true,
    });
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
                toggleRepeat={() =>
                  this.setState({
                    ...this.state,
                    repeatSong: !this.state.repeatSong,
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
