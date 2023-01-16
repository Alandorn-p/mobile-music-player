import React, { Component, createContext } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import * as FileSystem from "expo-file-system";
import { Audio } from "expo-av";
import { addSong, getAllSongs, getSong } from "../components/Storage";
import { musicPath } from "../misc/constants";
import { EncodingType, StorageAccessFramework } from "expo-file-system";

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
  filePath = FileSystem.documentDirectory + "music/";

  permissionAlert = () => {
    Alert.alert("Permission required", "Please say yes", [
      { text: "I am ready" },
      { text: "cancel", onPress: () => this.permissionAlert() },
    ]);
  };

  getPermission = async () => {
    //Make directory if not exist
    const dirInfo = await FileSystem.getInfoAsync(this.filePath);
    if (!dirInfo.exists) {
      await FileSystem.makeDirectoryAsync(this.filePath);
    }
    this.getAudioFiles(null);
    return;
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
    return (
      item.uri.includes(filePath) &&
      item.filename.endsWith(".mp3") &&
      !item.uri.includes("Test_folder")
    );

    // const filePath = "Music/MusicApp/Test_folder";
    // return item.uri.includes(filePath) && item.filename.endsWith(".mp3");
  }
  changeMediaUri(obj) {
    return {
      ...obj,
      uri: FileSystem.documentDirectory + "MusicApp/" + obj.filename,
      // uri:
      //   FileSystem.documentDirectory +
      //   "temp/%E3%82%84%E3%81%AA%E3%81%8E%E3%81%AA%E3%81%8E%20-%20%E4%B8%89%E3%81%A4%E8%91%89%E3%81%AE%E7%B5%90%E3%81%B3%E3%82%81%20(Audio).mp3",
    };
  }
  addToDownloadQueue = (item) => {
    return;
  };
  makeAudioObject = async (filename) => {
    console.log("making new entry for: ", filename);
    if (!filename.includes(".mp3")) {
      return { uri: "random", filename: "random", duration: 0 };
    }
    // If not found in cache
    //makes audio object (with keys duration, filename, and uri)
    const uri = this.filePath + filename;
    const sound = await Audio.Sound.createAsync({
      uri,
    });
    const obj = {
      uri,
      filename,
      duration: sound.status.durationMillis / 1000,
    };
    await addSong(filename, JSON.stringify(obj));

    return obj;
  };
  getAudioData = async (filename) => {
    //find in cache
    const result = await getSong(filename);
    if (result !== null) return JSON.parse(result);
    return await this.makeAudioObject(filename);
  };

  getAudioFiles = async (arr) => {
    console.log("arr is: ", arr);
    //arr is array of filenames OR NULL
    // const media = await MediaLibrary.getAssetsAsync({
    //   mediaType: "audio",
    //   first: 500,
    // });
    // let filteredMedia = media.assets.filter(this.filterAudioFilesFunc);
    // filteredMedia = filteredMedia.map(this.changeMediaUri);
    const { dataProvider, audioFiles } = this.state;
    if (arr === null) {
      const allFiles = await FileSystem.readDirectoryAsync(this.filePath);
      //only add files that arent already in audioFiles
      arr = allFiles.filter((val) => !this.state.audioFiles.includes(val));
    }

    const audioList = await Promise.all(arr.map(this.getAudioData));

    this.setState({
      ...this.state,
      audioFiles: [...audioFiles, ...audioList],
      dataProvider: dataProvider.cloneWithRows([...audioFiles, ...audioList]),
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
    await StorageAccessFramework.copyAsync({
      from: initialUri,
      to: musicPath + "/" + filename,
    });
    const fileInfo = await FileSystem.getInfoAsync(musicPath + "/" + filename);
    console.log(fileInfo.isDirectory);
  };
  downloadFile = async (filename, inputFileUri, outputDir) => {
    if (filename.endsWith(".mp3")) {
      filename = filename.slice(0, filename.length - 4);
    }
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

    return;
  };

  migrateAlbum = async () => {
    // audio/mpeg
    // Gets SAF URI to the album
    console.log("Sucees moving1");
    const albumName = "music/MusicApp";
    const albumUri = StorageAccessFramework.getUriForDirectoryInRoot();
    // Requests permissions
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync(
        albumUri + "/" + albumName
      );
    if (!permissions.granted) {
      return;
    }

    const permittedUri = permissions.directoryUri;
    const files = await StorageAccessFramework.readDirectoryAsync(permittedUri);

    // Checks if users selected the correct folder
    // if (!permittedUri.includes(albumName)) {
    //   console.log(permittedUri, " vs ", albumName);
    //   return;
    // }
    await Promise.all([files[0]].map(this.transferFile));
    // Moves files from external storage to internal storage

    // this.getAudioFiles(null);
    return;
    // // Creates assets from local files
    // const [newAlbumCreator, ...assets] = await Promise.all(
    //   migratedFiles.map <
    //     Promise <
    //     MediaLibrary.Asset >>
    //       (async (fileName) =>
    //         await MediaLibrary.createAssetAsync(outputDir + "/" + fileName))
    // );

    // // Album was empty
    // console.log(newAlbumCreator);
    // console.log(assets);
    // if (!newAlbumCreator) {
    //   console.log("fail?");
    //   return;
    // }
    // console.log("Sucees moving3");

    // // Creates a new album in the scoped directory
    // const newAlbum = await MediaLibrary.createAlbumAsync(
    //   albumName,
    //   newAlbumCreator,
    //   false
    // );
    // if (assets.length) {
    //   await MediaLibrary.addAssetsToAlbumAsync(assets, newAlbum, false);
    // }
    // console.log("Sucees moving4");
  };
  // waitRequest = async () => {
  //   console.log("asking permission");
  //   const obj = await FileSystem.requestDirectoryPermissionsAsync();
  //   console.log(obj);
  // };

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
            migrateAlbum: this.migrateAlbum,
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
