import { Dimensions, FlatList, StatusBar } from 'react-native';
import TopBar from './TopBar';
import PokeCard from './PokeCard';
import { Pokemon } from '../types/Pokemon';
import styled from 'styled-components/native'

const Body = styled.View`
`

const FlatListWrapper = styled.View`
  justify-content: center;
  flex-grow: 1;
  background-color: black;
`


const allPokemon = require('../assets/pokemon.json') as Pokemon[];
// const allAbilities = require('../assets/abilities.json') as Ability[];
function FlatListRender(e: any): any {
  return <PokeCard pokemon={e.item as Pokemon} /> as any; // this expression for sm reason just breaks so yeah
}

function MainScreen() {
  const screenWidth = Dimensions.get('window').width;

  const getItemLayout = (data: any, index: number) => {
    const aspectRatio = 0.8;
    const height = screenWidth / (2 * aspectRatio);
    return {
      length: height, // length means height in this csae
      offset: height * index,
      index: index
    };
  }

  return (
    <Body>
      <FlatListWrapper>
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
      </FlatListWrapper>

      {/* Status bar is atop network etc  */}

      <StatusBar backgroundColor="white" barStyle="dark-content" />
    </Body>
  );
}

export default MainScreen;