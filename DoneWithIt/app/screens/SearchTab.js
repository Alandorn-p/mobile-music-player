import React from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as FileSystem from "expo-file-system";
import BlobCourier from "react-native-blob-courier";
import * as MediaLibrary from "expo-media-library";
const { StorageAccessFramework } = FileSystem;
// import * as Permissions from "expo-permissions";

const SearchTab = () => {
  const onPress = async () => {
    console.log("hey");
    const request0 = {
      filename: "5MB.zip",
      method: "GET",
      mimeType: "application/zip",
      url: "http://ipv4.download.thinkbroadband.com/5MB.zip",
    };
    console.log(request0);
    console.log("requesting");
    console.log(BlobCourier.fetchBlob);
    const fetchedResult = await BlobCourier.fetchBlob(request0);
    console.log("done");
    // console.log(fetchedResult);
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

  return (
    <View style={styles.container}>
      <Text>Search Tab</Text>
      <TouchableWithoutFeedback onPress={onPress}>
        <View style={styles.button}>
          <Text>Touch Here</Text>
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SearchTab;
