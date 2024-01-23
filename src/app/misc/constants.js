import * as FileSystem from "expo-file-system";

export const musicPath = FileSystem.documentDirectory + "music/";

export const internalStoragePath = "MusicApp";

export const internalStoragePathTest = "MusicAppTest";

// INCLUDE ENDING /
// check ip with 'ipconfig /all', find IPv4 Address
export const ipAddress='192.168.1.118';
export const portNum='8000';

export const domainName = `http://${ipAddress}:${portNum}/`;
