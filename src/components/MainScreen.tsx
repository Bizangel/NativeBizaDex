import { Dimensions, FlatList, ListRenderItemInfo, StatusBar, StyleSheet, View } from 'react-native';
import TopBar from './TopBar';
import PokeCard from './PokeCard';
import { Pokemon } from '../types/Pokemon';

const allPokemon = require('../assets/pokemon.json') as Pokemon[];
// const allAbilities = require('../assets/abilities.json') as Ability[];
function FlatListRender(e: ListRenderItemInfo<Pokemon>) {
  return <PokeCard pokemon={e.item} />
}

function MainScreen() {
  const screenWidth = Dimensions.get('window').width;

  const getItemLayout = (data: any, index: number) => {
    return { length: screenWidth / 2, offset: screenWidth / 2 * index, index: index };
  }

  return (
    <View style={styles.body}>
      <View style={styles.verticalFlatListStyle}>
        <FlatList
          ListHeaderComponent={<TopBar />}
          stickyHeaderIndices={[0]}
          numColumns={2}
          getItemLayout={getItemLayout}
          // style={{ width: "100%", height: "100%" }}
          renderItem={FlatListRender}
          data={allPokemon}
          initialNumToRender={15}
          // viewabilityConfig={{ minimumViewTime: 1000 }}
          maxToRenderPerBatch={5}
          windowSize={5}
        />
      </View>

      {/* Status bar is atop network etc  */}

      <StatusBar backgroundColor="white" barStyle="dark-content" />
    </View>
  );
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  verticalFlatListStyle: {
    justifyContent: "center",
    flexGrow: 1,
    backgroundColor: "rgba(0,0,0,1)",
    // width: "100%",
    // height: "100%",
  }
});

export default MainScreen;