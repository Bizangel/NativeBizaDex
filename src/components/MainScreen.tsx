import { FlatList, StatusBar, StyleSheet, Text, View } from 'react-native';
import TopSearchBar from './TopSearchBar';
import PokeCard from './PokeCard';
import { textStyle } from '../styles/styles';
import { Ability, Pokemon } from '../types/Pokemon';

const allPokemon = require('../assets/pokemon.json') as Pokemon[];
const allAbilities = require('../assets/abilities.json') as Ability[];

function MainScreen() {
  return (
    <View style={styles.container}>

      <TopSearchBar />

      <Text style={[textStyle.default]}> hello </Text>
      <Text style={[textStyle.default]}> hot reloaded again 2</Text>

      <View style={{ justifyContent: "center", flexGrow: 1 }}>
        <FlatList
          numColumns={2}
          style={{ width: "100%" }}
          renderItem={(e) => <PokeCard pokemon={e.item} />}
          keyExtractor={e => e.id}
          data={allPokemon}
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