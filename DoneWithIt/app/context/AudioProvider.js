import React, { Component, createContext } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";

export const AudioContext = createContext();
export class AudioProvider extends Component {
  constructor(props) {
    // console.log("Thing is ");
    // console.log(props);
    super(props);
    this.state = {
      audioFiles: [],
      PermissionError: false,
      dataProvider: new DataProvider((r1, r2) => r1 !== r2),
      playbackObj: null,
      soundObj: null,
      currentAudio: {},
      isPlaying: false,
      currentAudio: null,
    };
  }

  permissionAlert = () => {
    Alert.alert("Permission required", "Please say yes", [
      { text: "I am ready" },
      { text: "cancel", onPress: () => this.permissionAlert() },
    ]);
  };

  getPermission = async () => {
    // Object {
    //   "canAskAgain": true,
    //   "expires": "never",
    //   "granted": false,
    //   "status": "undetermined",
    // }
    const permission = await MediaLibrary.getPermissionsAsync();
    console.log(permission);
    if (permission.granted) {
      //get audio files
      this.getAudioFiles();
    }
    if (!permission.canAskAgain && !permission.granted) {
      this.setState({ ...this.state, PermissionError: true });
    }
    if (!permission.granted && permission.canAskAgain) {
      const { status, canAskAgain } =
        await MediaLibrary.requestPermissionsAsync();
      if (status === "denied" && canAskAgain) {
        //display alrt to allow perms
        this.permissionAlert();
      }
      if (status === "denied" && !canAskAgain) {
        //display alrt to allow perms
        this.setState({ ...this.state, PermissionError: true });
      }
      if (status === "granted") {
        this.getAudioFiles();
      }
    }
  };
  filterAudioFilesFunc(item) {
    //only take mp3 files and files in the right directory
    const filePath = "Music/MusicApp";
    return item.uri.includes(filePath) && item.filename.endsWith(".mp3");
  }

  getAudioFiles = async () => {
    const { dataProvider, audioFiles } = this.state;
    // console.log("finding");
    const media = await MediaLibrary.getAssetsAsync({
      mediaType: "audio",
      first: 500,
    });
    const filePath = "Music/MusicApp";
    let filteredMedia = media.assets.filter(this.filterAudioFilesFunc);
    this.setState({
      ...this.state,
      audioFiles: [...audioFiles, ...filteredMedia],
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...filteredMedia,
      ]),
    });
  };

  componentDidMount() {
    this.getPermission();
  }
  printChild() {
    console.log(this.props.children);
    return this.props.children;
  }

  updateState = (prevState, newState = {}) => {
    this.setState({ ...prevState, ...newState });
  };
  render() {
    const {
      PermissionError,
      dataProvider,
      audioFiles,
      playbackObj,
      soundObj,
      currentAudio,
      isPlaying,
      currentAudioTitle,
    } = this.state;
    if (PermissionError) {
      return (
        <View style={styles.viewError}>
          <Text style={styles.textError}>Please give permission</Text>
        </View>
      );
    } else {
      return (
        <AudioContext.Provider
          value={{
            audioFiles,
            dataProvider,
            playbackObj,
            soundObj,
            currentAudio,
            updateState: this.updateState,
            isPlaying,
            currentAudioTitle,
          }}
        >
          {this.props.children}
        </AudioContext.Provider>
      );
    }
  }
}

const styles = StyleSheet.create({
  viewError: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  textError: {
    fontSize: 25,
    textAlign: "center",
    color: "red",
  },
});

export default AudioProvider;
