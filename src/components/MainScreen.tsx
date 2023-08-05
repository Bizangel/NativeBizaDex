import { FlatList, StatusBar, StyleSheet, View } from 'react-native';
import TopBar from './TopBar';
import PokeCard from './PokeCard';
import { Pokemon } from '../types/Pokemon';

const allPokemon = require('../assets/pokemon.json') as Pokemon[];
// const allAbilities = require('../assets/abilities.json') as Ability[];

function MainScreen() {
  return (
    <View style={styles.container}>

      <TopBar />

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
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MainScreen;