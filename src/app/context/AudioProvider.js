import React, { Component, createContext } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import {
  addMusicPath,
  addSong,
  clearAllStorage,
  getAllSongs,
  getMusicPath,
  getSong,
} from "../components/Storage";
import {
  musicPath,
  internalStoragePath,
  internalStoragePathTest,
} from "../misc/constants";
import { EncodingType, StorageAccessFramework } from "expo-file-system";

import { play } from "../misc/audioPlayer";

// const { requestDirectoryPermissionsAsync } = FileSystem;

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
      isPlaying: false,
      currentAudio: null,
      playbackPos: null,
      playbackDur: null,
      repeatOn: false,
      getAudioFiles: null,
      downloadQueue: [],
    };
    this.totalAudioCount = 0;
  }

  permissionAlert = () => {
    Alert.alert("Permission required", "Please say yes", [
      { text: "I am ready" },
      { text: "cancel", onPress: () => this.permissionAlert() },
    ]);
  };
  getFileName = (uri) => {
    return decodeURIComponent(uri.substring(uri.lastIndexOf("%2F") + 3));
  };
  requestPermissionGetSongsAsync = async () => {
    // request permission and gets mp3 files
    const permObj =
      await StorageAccessFramework.requestDirectoryPermissionsAsync(
        internalStoragePath
      );
    const uri = permObj.directoryUri;
    //add to cahce
    await addMusicPath(uri);
    return await StorageAccessFramework.readDirectoryAsync(uri);
  };
  getPermission = async () => {
    // await clearAllStorage( );
    const uriCached = await getMusicPath();
    let files;
    if (uriCached) {
      //cached path, try to read
      try {
        files = await StorageAccessFramework.readDirectoryAsync(uriCached);
      } catch (e) {
        //no permission, so ask
        files = await this.requestPermissionGetSongsAsync();
      }
    } else {
      // no cache path, ask for files
      files = await this.requestPermissionGetSongsAsync();
    }
    // console.log("Files are", files);
    files = files.filter((val) => val.endsWith(".mp3"));
    return this.getAudioFiles(files);
  };

  addToDownloadQueue = (item) => {
    return;
  };
  makeAudioObject = async (uri, playbackObj) => {
    let filename = this.getFileName(uri);
    //file names stored as encoding
    // console.log("making new entry for: ", filename);
    // If not found in cache
    //makes audio object (with keys duration, filename, and uri)
    const status = await playbackObj.loadAsync({ uri });
    // console.log("Status is", status);
    // console.log(Object.keys(sound));
    // const { sound, status } = await Audio.Sound.createAsync({
    //   uri,
    // });
    const obj = {
      uri,
      filename,
      duration: status.durationMillis / 1000,
    };
    await addSong(filename, JSON.stringify(obj));
    await playbackObj.unloadAsync();
    return obj;
  };
  getAudioData = async (uri, playbackObj) => {
    const filename = this.getFileName(uri);
    //find in cache
    const result = await getSong(filename);
    if (result !== null) return JSON.parse(result);
    return await this.makeAudioObject(uri, playbackObj);
  };

  getAudioFiles = async (arr) => {
    //arr is a array of Absolute uris to music files to load
    // console.log("arr is: ", arr);
    const { dataProvider, audioFiles } = this.state;

    // create playback Obj
    const playbackObj = new Audio.Sound();
    for (let i = 0; i < arr.length; i++) {
      console.log(`${i + 1}/${arr.length}`);
      await this.getAudioData(arr[i], playbackObj);
    }
    const audioList = await Promise.all(arr.map(this.getAudioData));

    this.setState({
      ...this.state,
      audioFiles: [...audioFiles, ...audioList],
      dataProvider: dataProvider.cloneWithRows([...audioFiles, ...audioList]),
      playbackObj,
    });
    //this.migrateAlbum("Music%2FMusicApp");
  };
  transferFile = async (initialUri) => {
    const filename = initialUri.substring(initialUri.lastIndexOf("%2F") + 3);
    const contents = await StorageAccessFramework.readAsStringAsync(
      initialUri,
      { encoding: EncodingType.Base64 }
    );
    const result = await StorageAccessFramework.createFileAsync(
      musicPath,
      filename,
      "audio/mpeg"
    );
    console.log("result is: ", result);
    return;
  };
  addToAudioList = async (filename, uri, duration) => {
    const { dataProvider, audioFiles } = this.state;
    const obj = { filename, uri, duration };
    this.setState({
      ...this.state,
      audioFiles: [...audioFiles, obj],
      dataProvider: dataProvider.cloneWithRows([...audioFiles, obj]),
    });
    await addSong(filename, JSON.stringify(obj));
  };
  downloadFile = async (filename, inputFileUri, duration) => {
    if (filename.endsWith(".mp3")) {
      filename = filename.slice(0, filename.length - 4);
    }
    const outputDir = await getMusicPath();
    const outputPath = await StorageAccessFramework.createFileAsync(
      outputDir,
      filename,
      "audio/mpeg"
    );

    const contentsToWrite = await FileSystem.readAsStringAsync(inputFileUri, {
      encoding: EncodingType.Base64,
    });
    await StorageAccessFramework.writeAsStringAsync(
      outputPath,
      contentsToWrite,
      {
        encoding: EncodingType.Base64,
      }
    );
    await this.addToAudioList(filename, outputPath, duration);
  };

  componentDidMount() {
    // this.waitRequest();
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
      playbackDur,
      playbackPos,
      repeatOn,
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
            isPlaying,
            currentAudioTitle,
            playbackDur,
            playbackPos,
            repeatOn,
            updateState: this.updateState,
            getAudioFiles: this.getAudioFiles,
            downloadFile: this.downloadFile,
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
