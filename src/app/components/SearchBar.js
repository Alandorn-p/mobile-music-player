import { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  TextInput,
  TouchableHighlight,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import color from "../misc/color";
import { Entypo } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import axios from "axios";

const SearchBar = ({ searchHandler }) => {
  //onPress is a 1 argument function, where the argument is the current text
  const [text, onChangeText] = useState("");
  const pressedSearch = () => {
    searchHandler(text);
    Keyboard.dismiss();
  };
  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="Enter Song search or URL"
        />
        {text && (
          <TouchableWithoutFeedback onPress={() => onChangeText("")}>
            <View style={{ justifyContent: "center", padding: 5 }}>
              <Entypo
                name="circle-with-cross"
                size={barHeight * 0.6}
                color="black"
              />
            </View>
          </TouchableWithoutFeedback>
        )}
      </View>
      <TouchableOpacity style={styles.rightContainer} onPress={pressedSearch}>
        <Feather name="search" size={barHeight} color="black" />
      </TouchableOpacity>
    </View>
  );
  //   return (
  //     <>
  //       <SafeAreaView style={styles.container}>
  //         <TextInput
  //           style={styles.input}
  //           onChangeText={onChangeText}
  //           value={text}
  //         />
  //         <View style={styles.rightContainer}>
  //           <Feather name="search" size={40} color="black" />
  //         </View>
  //       </SafeAreaView>
  //     </>
  //   );
};

const { width } = Dimensions.get("window");
// const sepHeight = thumbnailHeight * 0.1;

const rowWidth = width - 80;
const barHeight = 40;
const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    flexDirection: "row",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    height: barHeight,
    // margin: 12,
    padding: 10,
  },
  container: {
    alignItems: "stretch",
    alignSelf: "center",
    flexDirection: "row",
    width: "90%",
    height: barHeight,
    marginVertical: 10,
    // marginHorizontal: 10,
    // marginLeft: 10,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "red",
  },
  rightContainer: {
    marginHorizontal: 10,
    // alignItems: "center",
    // justifyContent: "center",
  },
});

export default SearchBar;
