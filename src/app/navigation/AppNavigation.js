import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import PlayList from "../screens/PlayList";
import SearchTab from "../screens/SearchTab";

import {
  AudioListImage,
  PlayerImage,
  PlayListImage,
  DownloadImage,
  ConfigImage,
} from "./navigationImages";
import ConfigPage from "../screens/ConfigPage";

const Tab = createBottomTabNavigator();
function AppNavigation(props) {
  const props_maker = (name, component, imageComponent) => {
    const options = {
      tabBarLabel: name,
      tabBarIcon: imageComponent,
    };
    return { name, component, options };
  };
  return (
    // <Text>hi</Text>
    <Tab.Navigator>
      <Tab.Screen {...props_maker("AudioList", AudioList, AudioListImage)} />
      <Tab.Screen {...props_maker("Player", Player, PlayerImage)} />
      <Tab.Screen {...props_maker("Playlist", PlayList, PlayListImage)} />
      <Tab.Screen {...props_maker("Download", SearchTab, DownloadImage)} />
      <Tab.Screen {...props_maker("Config", ConfigPage, ConfigImage)} />
    </Tab.Navigator>
  );
}

export default AppNavigation;
