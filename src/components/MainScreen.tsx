import { ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import TopSearchBar from './TopSearchBar';
import PokeCard from './PokeCard';
import { textStyle } from '../styles/styles';

function MainScreen() {
  return (
    <View style={styles.container}>

      <TopSearchBar />

      <ScrollView>
        <Text style={[textStyle.default]}> hello </Text>
        <Text style={[textStyle.default]}> some time to load the project </Text>
      </ScrollView>
      {/* Status bar is atop network etc  */}

      <StatusBar backgroundColor="white" barStyle="dark-content" />
      <PokeCard />
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