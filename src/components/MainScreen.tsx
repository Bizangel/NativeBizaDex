import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import TopSearchBar from './TopSearchBar';
import PokeCard from './PokeCard';
import { textStyle } from '../styles/styles';

function MainScreen() {
  return (
    <View style={styles.container}>

      <TopSearchBar />

      <Text style={[textStyle.default]}> hello </Text>
      <Text style={[textStyle.default]}> hot reloaded again 2</Text>

      <View style={{ justifyContent: "center", flexGrow: 1 }}>
        <FlatList
          numColumns={2}
          style={{ backgroundColor: "blue", width: "100%" }}
          renderItem={() => <PokeCard />}
          data={Array.from(Array(100).keys())}
        />
      </View>

      {/* Status bar is atop network etc  */}

      <StatusBar backgroundColor="white" barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainScreen;