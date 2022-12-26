import React, { Component, createContext } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import * as MediaLibrary from "expo-media-library";
import { DataProvider } from "recyclerlistview";
import * as FileSystem from "expo-file-system";
const { StorageAccessFramework } = FileSystem;

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
    };
    this.totalAudioCount = 0;
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
    };
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
    filteredMedia = filteredMedia.map(this.changeMediaUri);
    this.setState({
      ...this.state,
      audioFiles: [...audioFiles, ...filteredMedia],
      dataProvider: dataProvider.cloneWithRows([
        ...audioFiles,
        ...filteredMedia,
      ]),
    });
    this.migrateAlbum("Music%2FMusicApp");
  };

  migrateAlbum = async (albumName) => {
    // Gets SAF URI to the album
    console.log("Sucees moving1");
    const albumUri = StorageAccessFramework.getUriForDirectoryInRoot(albumName);
    console.log(albumUri);

    // Requests permissions
    const permissions =
      await StorageAccessFramework.requestDirectoryPermissionsAsync(albumUri);
    if (!permissions.granted) {
      return;
    }

    const permittedUri = permissions.directoryUri;
    // Checks if users selected the correct folder
    if (!permittedUri.includes(albumName)) {
      console.log(permittedUri, " vs ", albumName);
      return;
    }
    console.log("Sucees moving1.5");
    const mediaLibraryPermissions =
      await MediaLibrary.requestPermissionsAsync();
    if (!mediaLibraryPermissions.granted) {
      return;
    }

    // Moves files from external storage to internal storage
    await StorageAccessFramework.copyAsync({
      from: permittedUri,
      to: FileSystem.documentDirectory,
    });
    console.log("Sucees moving2");
    const outputDir = FileSystem.documentDirectory + "MusicApp";
    console.log("Sucees moving2.1", outputDir);
    const migratedFiles = await FileSystem.readDirectoryAsync(outputDir);
    console.log("Sucees moving2.2");

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
