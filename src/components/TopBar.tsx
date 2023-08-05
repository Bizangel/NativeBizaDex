import { useState } from "react"
import { View, StyleSheet, StatusBar, TextInput, Image } from "react-native";
import pokeImages from "../assets/pokeImages";

const styles = StyleSheet.create({
  topBarWrapper: {
    backgroundColor: "rgba(200,200,200,0.7)",
    height: 70,
    width: "100%",
    top: 0,
    // borderRadius: 30,
    display: "flex",
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    fontSize: 16,
  },

  searchBarWrapper: {
    width: "50%",
    backgroundColor: "blue",
  }
});


function TopBar() {
  const statusBarHeight = StatusBar.currentHeight || 0;
  const [currentSearch, setCurrentSearch] = useState("")

  return (
    <View style={[styles.topBarWrapper, { marginTop: statusBarHeight }]}>
      <View style={[styles.searchBarWrapper]}>
        <TextInput
          style={[styles.input]}
          placeholder="Search"
          onChangeText={(x) => setCurrentSearch(x)}
          value={currentSearch}
          defaultValue={""}
        />
      </View>


      <Image source={require('../icons/filter.png')} style={{ width: 40, height: 40 }} />
    </View>
  )
}

export default TopBar