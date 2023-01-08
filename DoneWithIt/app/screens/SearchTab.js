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
import QueryList from "../components/QueryList";
import filenamify from "react-native-filenamify";
// const { StorageAccessFramework } = FileSystem;
// import * as Permissions from "expo-permissions";

const SearchTab = () => {
  //Change here if domain changes
  const domainName = "http://172.20.10.21:8000/";
  const baseUrl = (x) => domainName + x;
  const searchUrl = (x) => baseUrl(`search/${encodeURIComponent(x)}`);
  const testUrl = baseUrl("test/");
  const [fetching, setFetch] = useState(false);
  const [results, setResults] = useState(null);
  const [searchTerm, setSearchTerm] = useState(null);
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
    console.log("pressed fetch");
    console.log("sent request for " + text);
    const postResponse = await axios.post(baseUrl("download/"), { url: text });
    const { url, title } = postResponse.data;
    const outputPath = await FileSystem.downloadAsync(
      baseUrl(url),
      FileSystem.documentDirectory + `${filenamify(title)}.mp3`
    );
    console.log(outputPath);
  };
  const onPress = async (text) => {
    console.log(results);
    if (!text) return;
    if (text === searchTerm) return;
    if (fetching) return;
    console.log("pressed");
    if (detectLink(text)) return postRequest(text);
    // If it is a url, then do a post request
    setFetch(true);
    try {
      const response = await axios.get(searchUrl(text), {
        timeout: timeoutDuration,
      });
      console.log(response.data.results);
      console.log("that was results");
      setResults(response.data.results);
      setSearchTerm(response.data.search_term);
      console.log("RESULTS IN SEARCH TAB", results);
      console.log(results);
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
      <SearchBar onPress={onPress} />
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

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchTab;
