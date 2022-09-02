import React from "react";
import {
  StyleSheet,
  Text,
  Touchable,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
const { StorageAccessFramework } = FileSystem;
// import * as Permissions from "expo-permissions";

const SearchTab = () => {
  const onPress = async () => {
    console.log("hey");
    const mediaLibraryPermissions =
      await MediaLibrary.requestPermissionsAsync();
    if (!mediaLibraryPermissions.granted) {
      console.log("permission denied");
      return;
    }
    const perm = await MediaLibrary.getPermissionsAsync(true);
    console.log(perm);
    const { uri } = await FileSystem.downloadAsync(
      "http://www.cs.cornell.edu/courses/cs1110/2022sp/assignments/assignment1/a1_skeleton.zip",
      FileSystem.documentDirectory + "a12.zip"
    );
    console.log("Finished downloading to ", uri);
    const files = await FileSystem.readDirectoryAsync(
      FileSystem.documentDirectory
    );
    console.log(
      `Files inside ${FileSystem.documentDirectory}:\n\n${JSON.stringify(
        files
      )}`
    );
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
