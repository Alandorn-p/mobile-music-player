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
import { musicPath } from "../misc/constants";
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
      await StorageAccessFramework.requestDirectoryPermissionsAsync("MusicApp");
    const uri = permObj.directoryUri;
    //add to cahce
    await addMusicPath(uri);
    return await StorageAccessFramework.readDirectoryAsync(uri);
  };
  getPermission = async () => {
    // const perm = await MediaLibrary.getPermissionsAsync(false);
    // const uri = StorageAccessFramework.getUriForDirectoryInRoot("MusicApp");
    //await clearAllStorage();
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

    // const uri = (
    //   await StorageAccessFramework.requestDirectoryPermissionsAsync()
    // ).directoryUri;
    // await addMusicPath(uri);

    // const uriCached = await getMusicPfath();

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
    // if (arr === null) {
    //   const allFiles = await FileSystem.readDirectoryAsync(this.filePath);
    //   //only add files that arent already in audioFiles
    //   arr = allFiles.filter((val) => !this.state.audioFiles.includes(val));
    // }
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
    await StorageAccessFramework.copyAsync({
      from: initialUri,
      to: musicPath + "/" + filename,
    });
    const fileInfo = await FileSystem.getInfoAsync(musicPath + "/" + filename);
    console.log(fileInfo.isDirectory);
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
