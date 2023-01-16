import AsyncStorage from "@react-native-async-storage/async-storage";
import { all } from "axios";

const songTag = "@Song:";
const playlistTag = "@Playlist:";

export const addSong = async (filename, val) => {
  await AsyncStorage.setItem(songTag + filename, val);
};

export const clearAllStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const filteredKeys = keys.filter(
    (val) => val.startsWith(songTag) || val.startsWith(playlistTag)
  );
  await AsyncStorage.multiRemove(filteredKeys);
  console.log("cleared all");
};
export const getAllSongs = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const allSongs = keys.filter((val) => val.startsWith(songTag));
  for (let i = 0; i < allSongs.length; i++) {
    const obj = await AsyncStorage.getItem(allSongs[i]);
    console.log(allSongs[i], "\nvalue: ", obj);
  }
};

export const getSong = async (filename) => {
  return await AsyncStorage.getItem(songTag + filename);
};

export const delSong = async (filename) => {
  await AsyncStorage.removeItem(songTag + filename);
};

export const clearSongs = async () => {
  const res = await AsyncStorage.getAllKeys();
  await AsyncStorage.multiRemove(res.filter((val) => val.startsWith(songTag)));
};

export const getPlaylist = async (playlistName) => {
  return await AsyncStorage.getItem(playlistTag + playlistName);
};
// may modify for more
export const addPlaylist = async (playlistName, val) => {
  await AsyncStorage.setItem(playlistTag + playlistName, val);
};

export const delPlaylist = async (playlistName) => {
  await AsyncStorage.removeItem(playlistTag + playlistName);
};
