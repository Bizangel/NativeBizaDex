import { Dimensions, ListRenderItemInfo, StatusBar } from 'react-native';
import TopBar from './TopBar';
import PokeCard from './PokeCard';
import { PokeType, Pokemon } from '../types/Pokemon';
import styled from 'styled-components/native'
import { useCallback, useMemo, useState } from 'react';
import { PokeFilter, filterPokemon } from './util/filterPokemon';
import { FlatList } from 'react-native-gesture-handler';
import { PokeDetails } from './PokeDetails';

const bgColor = "#212e33"
const Body = styled.View`
  background-color: ${bgColor};
  width: 100%;
  height: 100%;
`

const FlatListWrapper = styled.View`
  justify-content: center;
  flex-grow: 1;
  background-color: ${bgColor};
`

const EmptyDisplay = styled.Text`
  height: 80%;
  text-align: center;
  color: white;
  padding: 7%;

  font-size: 20px;
`


const allPokemon = require('../assets/pokemon.json') as Pokemon[];
// const allAbilities = require('../assets/abilities.json') as Ability[];


const AllTypes = [
  "Normal", "Fire", "Water", "Electric",
  "Grass", "Ice", "Fighting", "Poison",
  "Ground", "Flying", "Psychic", "Bug",
  "Rock", "Ghost", "Dragon", "Dark",
  "Steel", "Fairy"] as PokeType[];

const initialFilter: PokeFilter = { searchString: "", typesFilter: AllTypes }

function MainScreen() {
  const [currentFilter, setCurrentFilter] = useState<PokeFilter>(initialFilter)
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)

  const currentData = useMemo(() => filterPokemon(allPokemon, currentFilter), [currentFilter])
  const screenWidth = Dimensions.get('window').width;

  const updateCurrentSearchFilter = useCallback((x: string) => {
    setCurrentFilter(e => { return { ...e, searchString: x } })
  }, [setCurrentFilter])

  const renderPokecard = useCallback(({ item }: ListRenderItemInfo<Pokemon>) => {
    //@ts-ignore // for some reason this line is too complex so ignore
    return <PokeCard pokemon={item} setSelectedPokemon={setSelectedPokemon} />;
  }, [setSelectedPokemon])


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
          ListHeaderComponent={<TopBar currentSearch={currentFilter.searchString} setCurrentSearch={updateCurrentSearchFilter} />}
          stickyHeaderIndices={[0]}
          numColumns={2}
          getItemLayout={getItemLayout}
          // style={{ width: "100%", height: "100%" }}
          renderItem={renderPokecard}
          data={currentData}
          initialNumToRender={15}
          // viewabilityConfig={{ minimumViewTime: 1000 }}
          maxToRenderPerBatch={5}
          windowSize={5}
          extraData={[currentData]} // basically, dependency props of flatlist
        />

        {
          currentData.length === 0 &&
          <EmptyDisplay>
            No pokemon match your current query. Try adjusting your search / filter.
          </EmptyDisplay>
        }
      </FlatListWrapper>

      {selectedPokemon && <PokeDetails pokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon} />}

      {/* Status bar is atop network etc  */}

      <StatusBar backgroundColor="black" barStyle="default" />
    </Body>
  );
}

export default MainScreen;