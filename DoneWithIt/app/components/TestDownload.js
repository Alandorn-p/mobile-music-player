import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import { Camera, CameraType } from "expo-camera";
import { Button } from "react-native";

export default function TestDownload() {
  const saveFile = async (fileUri) => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, false);
    }
  };
  const download = () => {
    const uri = "http://techslides.com/demos/sample-videos/small.mp4";
    let fileUri = FileSystem.documentDirectory + "small.mp4";
    FileSystem.downloadAsync(uri, fileUri)
      .then(({ uri }) => {
        this.saveFile(uri);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return <Button title="Hi" onPress={download}></Button>;
}
