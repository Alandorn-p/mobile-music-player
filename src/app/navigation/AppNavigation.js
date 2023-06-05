import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AudioList from "../screens/AudioList";
import Player from "../screens/Player";
import PlayList from "../screens/PlayList";
import SearchTab from "../screens/SearchTab";

const Tab = createBottomTabNavigator();
function AppNavigation(props) {
  return (
    // <Text>hi</Text>
    <Tab.Navigator>
      <Tab.Screen name="AudioList" component={AudioList} />
      <Tab.Screen name="Player" component={Player} />
      <Tab.Screen name="PlayList" component={PlayList} />
      <Tab.Screen name="Download" component={SearchTab} />
    </Tab.Navigator>
  );
}

export default AppNavigation;
