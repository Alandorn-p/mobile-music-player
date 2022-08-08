import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import PlayList from "../screens/PlayList";

const Tab = createBottomTabNavigator();
function AppNavigation(props) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="AudioList" component={AudioList} />
      <Tab.Screen name="Player" component={Player} />
      <Tab.Screen name="PlayList" component={PlayList} />
    </Tab.Navigator>
  );
}

export default AppNavigation;
