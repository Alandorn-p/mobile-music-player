import { React, useContext } from "react";
import { StyleSheet, TextInput } from "react-native";
import { View } from "react-native";
import { ipContext } from "../context/configContexts";

function ConfigPage(props) {
  const { setIpAddress, setPort } = useContext(ipContext);

  return (
    <>
      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <TextInput
            style={{ height: 40 }}
            placeholder="Type IpAddress"
            onChangeText={(newText) => {
              setIpAddress(newText);
            }}
            defaultValue={"192.168.1"}
          />
        </View>
        <View style={styles.innerContainer}>
          <TextInput
            style={{ height: 40 }}
            placeholder="Type Port"
            onChangeText={(newText) => setPort(newText)}
            defaultValue={"8000"}
          />
        </View>
      </View>
    </>
  );
}

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
    //backgroundColor: "red",
  },
  rightContainer: {
    marginHorizontal: 10,
    // alignItems: "center",
    // justifyContent: "center",
  },
});

export default ConfigPage;
