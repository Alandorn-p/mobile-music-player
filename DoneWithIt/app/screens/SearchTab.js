import { useState } from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableWithoutFeedback,
  View,
  TextInput,
  ActivityIndicator,
} from "react-native";
import * as FileSystem from "expo-file-system";
import axios, { AxiosError } from "axios";
import BlobCourier from "react-native-blob-courier";
import * as MediaLibrary from "expo-media-library";
import SearchBar from "../components/SearchBar";
// const { StorageAccessFramework } = FileSystem;
// import * as Permissions from "expo-permissions";

const SearchTab = () => {
  const baseUrl = (x) => "http://172.20.10.21:8000/" + x;
  const searchUrl = (x) => baseUrl(`search/${encodeURIComponent(x)}`);
  const testUrl = baseUrl("test/");
  const [fetching, setFetch] = useState(false);
  const timeoutDuration = 15000;

  const onPress2 = async () => {
    console.log("hey");

    return;
    // RNFS.writeFile(path, 'Lorem ipsum dolor sit amet', 'utf8')
    try {
      // const response = await axios.get(test_url, {
      //   responseType: "arraybuffer",
      //   headers: { "content-type": "application/mpeg" },
      //   maxContentLength: Infinity,
      //   maxBodyLength: Infinity,
      // });
      const response = await axios.get(
        "https://images.unsplash.com/photo-1506812574058-fc75fa93fead",
        {
          responseType: "arraybuffer",
        }
      );
      setTimeout(() => {
        const stream = response;
        console.log(stream);
      }, 1000);

      //console.log(response.data);
    } catch (error) {
      console.log(error.message);
    }

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
  };
  const detectLink = (text) => {
    if (text.includes("youtu.be")) return true;
    return text.includes("youtube.com") && text.includes("/");
  };

  const postRequest = async (text) => {
    const response = await axios.post(baseUrl("download/"), { url: text });
    console.log(response.data);
  };
  const onPress = async (text) => {
    if (!text) return;
    console.log("pressed");
    if (detectLink(text)) return postRequest(text);
    // If it is a url, then do a post request
    setFetch(true);
    try {
      const response = await axios.get(searchUrl(text), {
        timeout: timeoutDuration,
      });
      console.log(response.data);
    } catch (err) {
      if (err instanceof AxiosError) {
        console.log("timeout");
        setFetch(false);
        return;
      } else {
        throw err;
      }
    }
    setFetch(false);
  };

  return (
    <>
      <SearchBar onPress={onPress} />
      {fetching && <ActivityIndicator size="large" />}
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

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchTab;
