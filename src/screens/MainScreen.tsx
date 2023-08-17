import { Dimensions, ListRenderItemInfo, StatusBar } from 'react-native';
import TopBar from '../components/TopBar';
import PokeCard from '../components/PokeCard';
import { PokeType, Pokemon } from '../types/Pokemon';
import styled from 'styled-components/native'
import { useCallback, useState, useEffect, useRef } from 'react';
import { PokeFilter, filterPokemon } from '../util/filterPokemon';
import { FlatList } from 'react-native-gesture-handler';
import { PokeDetails } from '../components/PokeDetails';
import { colorPalette } from '../styles/styles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { allPokemon } from '../common/pokeInfo';

const Body = styled.View`
  background-color: ${colorPalette.backgroundBlack};
  width: 100%;
  height: 100%;
`

const FlatListWrapper = styled.View`
  justify-content: center;
  flex-grow: 1;
  background-color: ${colorPalette.backgroundBlack};
`

const EmptyDisplay = styled.Text`
  height: 80%;
  text-align: center;
  color: ${colorPalette.textWhite};
  padding: 7%;

  font-size: 20px;
`

const AllTypes = [
  "Normal", "Fire", "Water", "Electric",
  "Grass", "Ice", "Fighting", "Poison",
  "Ground", "Flying", "Psychic", "Bug",
  "Rock", "Ghost", "Dragon", "Dark",
  "Steel", "Fairy"] as PokeType[];

const initialFilter: PokeFilter = { searchString: "", typesFilter: AllTypes }


const debounceDelay = 200;

function MainScreen(props: NativeStackScreenProps<RootStackParamList, 'MainScreen'>) {
  const preSelectedPoke = props.route.params.preSelectedPokemonId
  const [currentFilter, setCurrentFilter] = useState<PokeFilter>(initialFilter)
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [currentData, setCurrentData] = useState<Pokemon[]>(allPokemon);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    setSelectedPokemon(null);

    const timeout = setTimeout(() => {
      const foundPoke = allPokemon.find(e => e.id === preSelectedPoke)
      if (foundPoke)
        setSelectedPokemon(foundPoke)
    }, debounceDelay);

    return () => {
      clearTimeout(timeout);
    }
  }, [preSelectedPoke])

  // debounce filter for efficiency
  useEffect(() => {
    const timeout = setTimeout(() => {
      const filteredPoke = filterPokemon(allPokemon, currentFilter);
      setCurrentData(filteredPoke)
    }, debounceDelay);

    return () => {
      clearTimeout(timeout)
    }
  }, [currentFilter])

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
          ref={flatListRef}
          ListHeaderComponent={<TopBar currentSearch={currentFilter.searchString} setCurrentSearch={updateCurrentSearchFilter} />}
          stickyHeaderIndices={[0]}
          numColumns={2}
          getItemLayout={getItemLayout}
          // style={{ width: "100%", height: "100%" }}
          renderItem={renderPokecard}
          data={currentData}
          initialNumToRender={6}
          removeClippedSubviews={false}
          windowSize={7}
          maxToRenderPerBatch={3}
          updateCellsBatchingPeriod={350}
          extraData={[currentData]} // basically, dependency props of flatlist
        />

        {
          currentData.length === 0 &&
          <EmptyDisplay>
            No pokemon match your current query. Try adjusting your search / filter.
          </EmptyDisplay>
        }
      </FlatListWrapper>

      {selectedPokemon && <PokeDetails pokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon}
        fullDataRef={currentData}
        flatListRef={flatListRef}
        dataIdx={currentData.findIndex(e => selectedPokemon.id === e.id) ?? 0}
      />}

      {/* Status bar is atop network etc  */}

      <StatusBar backgroundColor="black" barStyle="default" />
    </Body>
  );
}

export default MainScreen;