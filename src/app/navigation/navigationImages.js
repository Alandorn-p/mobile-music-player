import {
  FontAwesome,
  MaterialIcons,
  AntDesign,
  Ionicons,
} from "@expo/vector-icons";
import React from "react";

export const AudioListImage = ({ color, size }) => (
  <FontAwesome name="music" size={size} color={color} />
);

export const PlayerImage = ({ color, size }) => (
  <AntDesign name="play" size={size} color={color} />
);

export const PlayListImage = ({ color, size }) => (
  <MaterialIcons name="playlist-play" size={size} color={color} />
);

export const DownloadImage = ({ color, size }) => (
  <AntDesign name="download" size={size} color={color} />
);

export const ConfigImage = ({ color, size }) => (
  <Ionicons name="settings" size={size} color={color} />
);
