import React, { Component, useEffect } from "react";
import {
  Button,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { AudioContext } from "../context/AudioProvider";
import { RecyclerListView, LayoutProvider } from "recyclerlistview";
import AudioListItem from "../components/AudioListItem";
import OptionModal from "../components/OptionModal";

export class AudioList extends Component {
  static contextType = AudioContext;

  constructor(props) {
    super(props);
    this.state = {
      OptionModalVisible: false,
    };
    this.currentItem = {};
  }

  layoutProvider = new LayoutProvider(
    (i) => "audio",
    (type, dim) => {
      switch (type) {
        case "audio":
          dim.width = Dimensions.get("window").width;
          dim.height = 70;
          break;
        default:
          dim.width = dim.height = 0;
      }
    }
  );

  rowRenderer = (type, item) => {
    return (
      <AudioListItem
        title={item.filename}
        duration={item.duration}
        onOptionPress={() => {
          this.currentItem = item;
          this.setState({ ...this.setState, OptionModalVisible: true });
        }}
        onPlayPress={() => console.log("TODO")}
      />
    );
  };

  render() {
    return (
      <AudioContext.Consumer>
        {({ dataProvider }) => {
          return (
            <View style={{ flex: 1 }}>
              <RecyclerListView
                dataProvider={dataProvider}
                layoutProvider={this.layoutProvider}
                rowRenderer={this.rowRenderer}
              />
              <OptionModal
                currentItem={this.currentItem}
                visible={this.state.OptionModalVisible}
                onClose={() =>
                  this.setState({
                    ...this.state,
                    OptionModalVisible: false,
                  })
                }
              />
            </View>
          );
        }}
      </AudioContext.Consumer>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
  },
  textFiles: {
    padding: 10,
    borderBottomColor: "black",
    borderBottomWidth: 2,
  },
});

export default AudioList;
