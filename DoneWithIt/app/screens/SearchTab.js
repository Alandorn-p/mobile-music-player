import { useState, useEffect, useContext, useReducer, useRef } from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableWithoutFeedback,
  View,
  TextInput,
  ActivityIndicator,
  Button,
} from "react-native";
import * as FileSystem from "expo-file-system";
import axios, { AxiosError } from "axios";
import BlobCourier from "react-native-blob-courier";
import * as MediaLibrary from "expo-media-library";
import SearchBar from "../components/SearchBar";
import QueryList from "../components/QueryList";
import filenamify from "react-native-filenamify";
import { Cache } from "react-native-cache";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { QueueContext } from "../context/NotificationBanner";
import { domainName, musicPath } from "../misc/constants";
import { AudioContext } from "../context/AudioProvider";
import { clearAll, clearAllStorage } from "../components/Storage";

// const { StorageAccessFramework } = FileSystem;
// import * as Permissions from "expo-permissions";

const SearchTab = () => {
  // 1 argument function to push downloaded object to notify
  const pushToQueue = useContext(QueueContext);
  const audioContext = useContext(AudioContext);
  const baseUrl = (x) => domainName + x;
  const searchUrl = (x) => baseUrl(`search/${encodeURIComponent(x)}`);
  const testUrl = baseUrl("test/");
  const [fetching, setFetch] = useState(false);
  const [results, setResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
  const musicPath = FileSystem.cacheDirectory;
  const fileCounter = useRef(0);

  // const [finishedItem, setfinishedItem] = useState(null);
  const timeoutDuration = 15000;

  const cache = new Cache({
    namespace: "myapp",
    policy: {
      maxEntries: 10, // if unspecified, it can have unlimited entries
      stdTTL: 0, // the standard ttl as number in seconds, default: 0 (unlimited)
    },
    backend: AsyncStorage,
  });

  // useEffect(
  //   () => setNotificationQueue((prev) => [...prev, counter]),
  //   [counter]
  // );

  // disable this block in production
  useEffect(() => {
    const clearCache = async () => {
      await cache.clearAll();
    };
    clearCache();
  }, []);
  // useEffect(() => {
  //   if (finishedItem !== null) bannerShow();
  // }, [finishedItem]);

  // RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
  // try {
  //   // const response = await axios.get(test_url, {
  //   responseType: "arraybuffer",
  //   headers: { "content-type": "application/mpeg" },
  //   maxContentLength: Infinity,
  //   maxBodyLength: Infinity,
  // });
  // const response = await axios.get(
  //   "https://images.unsplash.com/photo-1506812574058-fc75fa93fead",
  //   {
  //     responseType: "arraybuffer",
  //   }
  // );
  // setTimeout(() => {
  //   const stream = response;
  //   console.log(stream);
  // }, 1000);

  //console.log(response.data);
  // } catch (error) {
  //   console.log(error.message);
  // }

  // FileSystem.downloadAsync(
  //   "http://172.20.10.21:8000/",
  //   FileSystem.documentDirectory + "test_music2.mp3"
  // )
  //   .then(({ uri }) => {
  //     console.log("Finished downloading to ", uri);
  //   })
  //   .catch((error) => {
  //     console.error(error);
  //   });
  // const mediaLibraryPermissions =
  //   await MediaLibrary.requestPermissionsAsync();
  // if (!mediaLibraryPermissions.granted) {
  //   console.log("permission denied");
  //   return;
  // }
  // const perm = await MediaLibrary.getPermissionsAsync(true);
  // console.log(perm);

  // const { uri } = await FileSystem.downloadAsync(
  //   "http://www.cs.cornell.edu/courses/cs1110/2022sp/assignments/assignment1/a1_skeleton.zip",
  //   FileSystem.documentDirectory + "a12.zip"
  // );
  // console.log("Finished downloading to ", uri);
  // newUri = FileSystem.documentDirectory + "MusicApp";
  // const files = await FileSystem.readDirectoryAsync(newUri);
  // console.log(`Files inside ${newUri}:\n\n${JSON.stringify(files)}`);
  // FileSystem.deleteAsync(`${newUri}/Polaris.mp3`, { idempotent: true });

  const clearDirectory = async () => {
    const files = await FileSystem.readDirectoryAsync(musicPath);
    console.log("files are: ", files);
    for (let i = 0; i < files.length; i++) {
      await FileSystem.deleteAsync(musicPath + files[i]);
    }
    console.log("delete successful");
  };
  const showDirectory = async () => {
    const files = await FileSystem.readDirectoryAsync(musicPath);
    console.log("files are: ", files);
  };
  const generateFileNameRec = async (name, ind) => {
    console.log(name, ind);
    const basename = `${name} (${ind}).mp3`;
    const fileInfo = await FileSystem.getInfoAsync(musicPath + basename);
    if (!fileInfo.exists) return basename;
    //else it exists
    return await generateFileNameRec(name, ind + 1);
  };
  const generateFileName = () => {
    // const basename = `${name}.mp3`;
    // const fileInfo = await FileSystem.getInfoAsync(musicPath + basename);
    // if (!fileInfo.exists) return basename;
    // return await generateFileNameRec(name, 1);
    fileCounter.current += 1;
    return `temp${fileCounter.current}.mp3`;
  };

  const detectLink = (text) => {
    if (text.includes("youtu.be")) return true;
    return text.includes("youtube.com") && text.includes("/");
  };

  const postRequest = async (text) => {
    console.log("pressed fetch");
    console.log("sent request for " + text);
    let postResponse;
    try {
      console.log("send post");
      postResponse = await axios.post(
        baseUrl("download/"),
        { url: text },
        { timeout: timeoutDuration }
      );
    } catch (err) {
      console.log("post error");
      if (err instanceof AxiosError) {
        console.log("timeout");
        return;
      }
    }
    console.log("post received");
    const { url, title, duration } = postResponse.data;
    const downloadToTitle = generateFileName();

    const { uri, status } = await FileSystem.downloadAsync(
      baseUrl(url),
      musicPath + downloadToTitle
    );
    console.log(uri);
    await audioContext.downloadFile(title, uri, duration);
    pushToQueue(title);
  };

  const setSearchStates = (json) => {
    setResults(json.results);
    setSearchTerm(json.search_term);
  };

  const onSearchPress = async (text) => {
    // console.log(results);

    if (!text) return;
    if (text === searchTerm) return;
    if (fetching) return;
    console.log("pressed");
    const cachedResult = await cache.get(text.toLowerCase());

    if (cachedResult !== undefined) {
      // console.log("cache hit!");
      //found in cache, no need to search
      setSearchStates(JSON.parse(cachedResult));

      return;
    }

    // console.log("cache is ", cachedResult);
    if (detectLink(text)) return postRequest(text);
    // If it is a url, then do a post request
    setFetch(true);
    try {
      const response = await axios.get(searchUrl(text), {
        timeout: timeoutDuration,
      });
      setSearchStates(response.data);
      await cache.set(
        response.data.search_term.toLowerCase(),
        JSON.stringify(response.data)
      );
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log("timeout");
        setFetch(false);
        return;
      } else {
        throw err;
      }
    }
    console.log("here done");
    setFetch(false);
    console.log(fetching);
  };

  return (
    <>
      <SearchBar searchHandler={onSearchPress} />
      {fetching && <ActivityIndicator size="large" />}
      {results && (
        <QueryList
          onPress={postRequest}
          data={results}
          searchTerm={searchTerm}
        />
      )}
    </>

    // <View style={styles.container}>

    // {/* <Text>Search Tab</Text>
    // <TouchableWithoutFeedback onPress={onPress}>
    //   <View style={styles.button}>
    //     <Text>Touch Here</Text>
    //   </View>
    // </TouchableWithoutFeedback> */}
    // </View>
  );
};

// class Counter {
//   constructor() {
//     console.log("being created");
//     this.value = 0;
//   }
//   increment() {
//     this.value++;
//   }
//   get() {
//     return this.value;
//   }
// }

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchTab;
