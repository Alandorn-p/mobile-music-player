import {
  Dimensions,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
  Image,
} from "react-native";
import React, { Component, useEffect, useState } from "react";
import { Entypo } from "@expo/vector-icons";
import color from "../misc/color";
import { secToMin } from "./AudioListItem";
import {
  RecyclerListView,
  DataProvider,
  LayoutProvider,
} from "recyclerlistview";

function QueryListItem({
  title,
  length,
  thumbnail_url,
  author,
  publish_date,
  onPress,
}) {
  const [clicked, onClick] = useState(false);
  useEffect(() => {
    null;
    return () => {
      onClick(false);
    };
  }, [title, length, thumbnail_url, author, publish_date]);

  const onPressWrapper = () => {
    // if (!clicked)
    {
      onClick(true);
      onPress();
    }
  };
  return (
    <>
      <View style={styles.container}>
        <TouchableWithoutFeedback onPress={onPressWrapper}>
          {clicked ? (
            <Text style={styles.downloadingText}> Downloading...</Text>
          ) : (
            <View style={styles.leftContainer}>
              <View>
                <Image
                  style={styles.imageStyle}
                  source={{
                    uri: thumbnail_url,
                  }}
                />
              </View>
              <View style={styles.text}>
                <View style={styles.titleView}>
                  <Text numberOfLines={2} style={styles.titleText}>
                    {title}
                  </Text>
                </View>
                <View style={styles.descripView}>
                  <Text style={styles.timeText}>{author}</Text>
                  <Text style={styles.timeText}>
                    {secToMin(length) + "   " + publish_date}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </TouchableWithoutFeedback>
      </View>
      <View style={styles.seperatorView}></View>
    </>
  );
}

export default class QueryList extends Component {
  constructor(props) {
    super(props);
    this._onPress = props.onPress;
    this._dataProvider = new DataProvider((r1, r2) => {
      return r1 !== r2;
    });
    this._layoutProvider = new LayoutProvider(
      (i) => "item",
      (type, dim) => {
        switch (type) {
          case "item":
            dim.width = Dimensions.get("window").width;
            dim.height = rowHeight + sepHeight + 10;
            break;
          default:
            dim.width = dim.height = 0;
        }
      }
    );
    this.state = {
      dataProvider: this._dataProvider.cloneWithRows(props.data),
    };
  }
  componentDidUpdate(prevProps) {
    if (prevProps.searchTerm !== this.props.searchTerm) {
      this.setState({
        dataProvider: this._dataProvider.cloneWithRows(this.props.data),
      });
    }
  }

  _rowRenderer = (type, data) => {
    //data is info from JSON
    switch (type) {
      case "item":
        return (
          <QueryListItem
            {...data}
            onPress={() => {
              console.log("pressed");
              this._onPress(data.watch_url);
            }} // onPress={() => console.log("pressed")}
          />
        );
      default:
        return null;
    }
  };
  render() {
    return (
      <RecyclerListView
        layoutProvider={this._layoutProvider}
        dataProvider={this.state.dataProvider}
        rowRenderer={this._rowRenderer}
      />
    );
  }
}
const { width } = Dimensions.get("window");
const rowHeight = 60;
const sepHeight = 1;
// const sepHeight = thumbnailHeight * 0.1;

const rowWidth = 0.9 * width;

const titleProportion = 0.6;
const descripProportion = 1 - titleProportion;
const propToHeight = (proportion) => proportion * rowHeight;
const styles = StyleSheet.create({
  downloadingText: {
    fontSize: propToHeight(0.5),
    marginHorizontal: 5,
  },
  titleView: {
    height: propToHeight(titleProportion),
  },
  descripView: {
    height: propToHeight(descripProportion),
  },
  imageStyle: {
    height: rowHeight - 1,
    width: ((rowHeight - 1) * 16) / 9,
  },
  container: {
    flexDirection: "row",
    alignSelf: "center",
    width: rowWidth,
    height: rowHeight + sepHeight,
    marginVertical: 5,
    //backgroundColor: "red",
  },
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  rightContainer: {
    flexBasis: 50,
    //backgroundColor: "yellow",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbnail: {
    height: rowHeight,
    //backgroundColor: color.FONT_LIGHT,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    width: width - 180,
    paddingLeft: 10,
  },
  titleText: {
    lineHeight: propToHeight(titleProportion / 2),
    fontSize: propToHeight(titleProportion / 2),
    color: color.FONT,
  },
  seperatorView: {
    width: rowWidth,
    backgroundColor: "#333",
    opacity: 0.3,
    height: 1,
    //height: sepHeight,
    alignSelf: "center",
  },
  timeText: {
    lineHeight: propToHeight(descripProportion / 2),
    fontSize: propToHeight(descripProportion / 2),
    adjustsFontSizeToFit: true,
    color: color.FONT_LIGHT,
  },
});
