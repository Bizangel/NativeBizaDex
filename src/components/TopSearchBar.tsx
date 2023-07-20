import { useState } from "react"
import { View, StyleSheet, StatusBar, TextInput } from "react-native";

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: "rgba(200,200,200,0.7)",
    height: 100,
    width: "100%",
    top: 0,
    borderRadius: 30,
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
  },
  input: {
    fontSize: 16,
  }
});

function TopSearchBar() {
  const statusBarHeight = StatusBar.currentHeight || 0;
  const [currentSearch, setCurrentSearch] = useState("")

  return (
    <View style={[styles.wrapper, { marginTop: statusBarHeight }]}>
      <TextInput
        style={[styles.input]}
        placeholder="Search"
        onChangeText={(x) => setCurrentSearch(x)}
        value={currentSearch}
        defaultValue={""}
      />
    </View>
  )
}

export default TopSearchBar