import { useState } from "react"
import { View, StyleSheet, TextInput, Image } from "react-native";

const styles = StyleSheet.create({
  topBarWrapper: {
    backgroundColor: 'rgba(255,255,255, .7)',

    height: 70,
    width: "100%",


    display: "flex",
    flexDirection: "row",

    alignItems: "center",
    justifyContent: "center",
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
  const [currentSearch, setCurrentSearch] = useState("")

  return (
    <View style={[styles.topBarWrapper]}>
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