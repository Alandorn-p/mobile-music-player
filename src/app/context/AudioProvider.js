import { Audio, InterruptionModeAndroid } from "expo-av";
import * as FileSystem from "expo-file-system";
import { EncodingType, StorageAccessFramework } from "expo-file-system";
import React, { Component, createContext } from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import { DataProvider } from "recyclerlistview";
import {
  addMusicPath,
  addSong,
  addToPlaylist,
  createNewPlaylist,
  getMusicPath,
  getPlaylist,
  getSong,
} from "../components/Storage";
import { internalStoragePath, musicPath } from "../misc/constants";
import { pause, play, playNext, resume } from "../misc/audioPlayer";

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
      curSongIndex: 0,
      songList: [],
      repeatSong: false,
    };
    this.totalAudioCount = 0;
    console.log("FINISH CON");
    console.log(this.state);
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
    await StorageAccessFramework.readAsStringAsync(initialUri, {
      encoding: EncodingType.Base64,
    });
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

  initPlaybackObj = () => {
    return new Audio.Sound();
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
    Audio.setAudioModeAsync({
      staysActiveInBackground: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      //playThroughEarpieceAndroid: true,
    });
  }

  loadPlaylist = async (playListName) => {
    const { contents } = await getPlaylist(playListName);

    return await Promise.all(contents.map((filename) => getSong(filename)));
  };
  randomListGen = (len) => {
    const alist = Array.from(Array(len).keys());
    for (let i = alist.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      let temp = alist[i];
      alist[i] = alist[j];
      alist[j] = temp;
    }
    // console.log(alist);
    return alist;
  };

  resetRandomPlaylist = (audio, songList = null) => {
    if (!songList) {
      songList = this.state.songList;
    }
    const lst = this.randomListGen(
      songList.length || this.state.audioFiles.length
    );
    if (audio !== null) {
      const ind = songList.indexOf(audio);
      const ind_in_lst = lst.indexOf(ind);
      //swap
      [lst[0], lst[ind_in_lst]] = [lst[ind_in_lst], lst[0]];
    }
    return lst.map((index) => this.state.audioFiles[index]);
  };

  getNextSongIndex = () => {
    let nextSongIndex = this.state.repeatSong
      ? this.state.curSongIndex
      : this.state.curSongIndex + 1;
    return nextSongIndex;
  };

  _onPlaybackStatusUpdate = async (playbackStatus) => {
    // console.log("PRINTED");
    let { songList, playbackObj } = this.state;
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
        this.updateState(this.state, {
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
        let nextSongIndex = this.getNextSongIndex();

        if (nextSongIndex === this.state.songList.length) {
          songList = this.resetRandomPlaylist(null, songList);
          nextSongIndex = 0;
        }

        let audio = this.state.songList[nextSongIndex];
        // console.log(playbackObj);
        const status = await playNext(playbackObj, audio.uri);
        this.updateState(this.state, {
          soundObj: status,
          currentAudio: audio,
          isPlaying: true,
          currentAudioTitle: audio.filename,
          songList: songList,
          curSongIndex: nextSongIndex,
        });
      }
    }
  };

  handleAudioPress = async (audio, playlistName = null) => {
    // return;
    const { soundObj, playbackObj, currentAudio, currentAudioTitle } =
      this.state;
    console.log("Pressed on: ", audio.uri);

    let newSongList;

    if (playlistName === null) {
      newSongList = this.state.audioFiles;
    } else {
      newSongList = await this.loadPlaylist(playlistName);
    }

    if (soundObj === null) {
      // if nothing is playing (first time)
      const playbackObj = this.initPlaybackObj();
      newSongList = this.resetRandomPlaylist(audio, newSongList);
      console.log("MADE NEW SONG", newSongList);

      const status = await play(playbackObj, audio.uri);
      this.updateState(this.state, {
        playbackObj,
        soundObj: status,
        currentAudio: audio,
        currentAudioTitle: audio.filename,
        isPlaying: true,
        songList: newSongList,
      });
      playbackObj.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
      return;
    }
    //pause audio
    if (
      soundObj.isLoaded &&
      soundObj.isPlaying &&
      //CHANGED TO COMPARE URI
      currentAudio.uri === audio.uri
    ) {
      console.log("already playing");
      //audio is already playing
      const status = await pause(playbackObj);
      this.updateState(this.state, {
        soundObj: status,
        isPlaying: false,
      });
      return;
    }

    //resume audio that was previously playing
    if (
      soundObj.isLoaded &&
      !soundObj.isPlaying &&
      currentAudio.uri === audio.uri
    ) {
      const status = await resume(playbackObj);
      this.updateState(this.state, {
        soundObj: status,
        isPlaying: true,
      });
      return;
    }
    //play another audio
    if (
      //soundObj.isLoaded &&
      currentAudio.uri !== audio.uri
    ) {
      newSongList = this.resetRandomPlaylist(audio, newSongList);
      const status = await playNext(playbackObj, audio.uri);
      this.updateState(this.state, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioTitle: audio.filename,
        songList: newSongList,
        curSongIndex: 0,
      });
    }
  };

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
            getAudioFiles: this.getAudioFiles,
            downloadFile: this.downloadFile,
            initPlaybackObj: this.initPlaybackObj,
            handleAudioPress: this.handleAudioPress,
            testState: () => console.log("TEST STATE:", this.state),
            testAddToPlaylist: async () => {
              console.log("starting callback");
              const testPlayListName = "TestPlaylist";
              console.log("starting callback2");
              await createNewPlaylist(testPlayListName);
              console.log("starting callback3");
              await addToPlaylist(
                testPlayListName,
                this.state.audioFiles[0].filename
              );
              console.log("starting callback4");
              await addToPlaylist(
                testPlayListName,
                this.state.audioFiles[1].filename
              );
              console.log(await this.loadPlaylist(testPlayListName));
            },
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
