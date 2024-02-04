import AsyncStorage from "@react-native-async-storage/async-storage";

const songTag = "@Song:";
const playlistTag = "@Playlist:";
const pathTag = "@Path:";


//songs: string :> { filename, uri, duration }
//playlist: string :> {name :string, contents : [string]}

export const addMusicPath = async (path) => {
  await AsyncStorage.setItem(pathTag, path);
};
export const getMusicPath = async () => {
  return await AsyncStorage.getItem(pathTag);
};
export const addSong = async (filename, val) => {
  await AsyncStorage.setItem(songTag + filename, val);
};

export const clearAllStorage = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const filteredKeys = keys.filter(
    (val) =>
      val.startsWith(songTag) ||
      val.startsWith(playlistTag) ||
      val.startsWith(pathTag)
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
  const res= await AsyncStorage.getItem(playlistTag + playlistName);
  return JSON.parse(res)
};
// may modify for more
export const createNewPlaylist = async (playlistName) => {
  const obj = { name: playlistName, contents: [] };
  await AsyncStorage.setItem(playlistTag + playlistName, JSON.stringify(obj));
};

export const addToPlaylist = async (playlistName, filename) => {
    console.log(filename)
    //val is string, song name
  const playlistStr = await AsyncStorage.getItem(playlistTag + playlistName);
  console.log(playlistStr)
  const { name, contents } = JSON.parse(playlistStr);
  const newObj = { name, contents: [...contents, filename] };
  await AsyncStorage.setItem(
    playlistTag + playlistName,
    JSON.stringify(newObj)
  );
};

export const removeFromPlaylist = async (playlistName, filename) => {
  const playlistStr = await AsyncStorage.getItem(playlistTag + playlistName);
  const { name, contents } = JSON.parse(playlistStr);
  const newContents = contents.filter((songName) => songName != filename);
  const newObj = { name, contents: newContents };
  await AsyncStorage.setItem(
    playlistTag + playlistName,
    JSON.stringify(newObj)
  );
};

export const delPlaylist = async (playlistName) => {
  await AsyncStorage.removeItem(playlistTag + playlistName);
};


export const getAllPlaylists = async () => {
  const keys = await AsyncStorage.getAllKeys();
  const allSongs = keys.filter((val) => val.startsWith(playlistTag));
  for (let i = 0; i < allSongs.length; i++) {
    const obj = await AsyncStorage.getItem(allSongs[i]);
    console.log(allSongs[i], "\nvalue: ", obj);
  }
  return allSongs;
};
