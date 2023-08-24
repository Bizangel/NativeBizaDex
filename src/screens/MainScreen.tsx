import { Dimensions, StatusBar } from 'react-native';
import TopBar from '../components/TopBar';
import PokeCard from '../components/PokeCard';
import { Pokemon } from '../types/Pokemon';
import styled from 'styled-components/native'
import React, { useCallback, useState, useEffect, useRef } from 'react';
import { filterPokemon } from '../util/filterPokemon';
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { PokeDetails } from '../components/PokeDetails';
import { colorPalette } from '../styles/styles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { PokeFilter, allPokemon, initialPokefilter, pokeMapping } from '../common/pokeInfo';
import { PokeFilterMenu } from '../components/PokeFilterMenu';
import { isEqual as deepEqual } from "lodash"

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

const MemoPokeFilterMenu = React.memo(PokeFilterMenu)
const MemodPokedetails = React.memo(PokeDetails)

const debounceDelay = 200;

function MainScreen(props: NativeStackScreenProps<RootStackParamList, 'MainScreen'>) {
  const preSelectedPoke = props.route.params.preSelectedPokemonId
  const [currentFilter, setCurrentFilter] = useState<PokeFilter>(initialPokefilter)
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [currentData, setCurrentData] = useState<Pokemon[]>(allPokemon);
  const flatListRef = useRef<FlashList<Pokemon>>(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const onTopFilterClick = useCallback(() => {
    setShowFilterMenu(true);
  }, [setShowFilterMenu])

  useEffect(() => {
    setSelectedPokemon(null);

    const timeout = setTimeout(() => {
      if (!preSelectedPoke)
        return;

      const foundPoke = pokeMapping.get(preSelectedPoke)
      if (!foundPoke)
        return;

      setSelectedPokemon(foundPoke)
    }, debounceDelay);

    return () => {
      clearTimeout(timeout);
    }
  }, [preSelectedPoke])

  // automatically scroll to selected pokemon, should it be available in the list
  // if not available, well we don't really care.
  useEffect(() => {
    if (!selectedPokemon)
      return;

    const foundIndex = currentData.map(e => e.id).indexOf(selectedPokemon.id)
    if (foundIndex !== -1)
      flatListRef.current?.scrollToIndex({ animated: true, index: foundIndex, viewPosition: 0 });
  }, [selectedPokemon, currentData])

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

  const renderPokecard: ListRenderItem<Pokemon> = useCallback(({ item }) => {
    //@ts-ignore // for some reason this line is too complex so ignore
    return <PokeCard pokemon={item} setSelectedPokemon={setSelectedPokemon} />;
  }, [setSelectedPokemon])

  const dismissLayout = useCallback(() => {
    setShowFilterMenu(false);
  }, [])

  const hasFilterChanged = !deepEqual(currentFilter, initialPokefilter);

  return (
    <Body>
      <FlatListWrapper>
        <TopBar currentSearch={currentFilter.searchString} setCurrentSearch={updateCurrentSearchFilter} onFilterClick={onTopFilterClick} displayFilterIndicator={hasFilterChanged} />
        <FlashList
          ref={flatListRef}
          numColumns={2}
          estimatedItemSize={screenWidth / 2}
          renderItem={renderPokecard}
          data={currentData}
          extraData={[updateCurrentSearchFilter, onTopFilterClick]} // basically, dependency props of flatlist
        />

        {
          currentData.length === 0 &&
          <EmptyDisplay>
            No pokemon match your current query. Try adjusting your search / filter.
          </EmptyDisplay>
        }
      </FlatListWrapper>

      {selectedPokemon && <MemodPokedetails pokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon}
        fullDataRef={currentData}
        dataIdx={currentData.findIndex(e => selectedPokemon.id === e.id) ?? 0}
      />}

      {
        showFilterMenu && <MemoPokeFilterMenu currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} dismissLayout={dismissLayout} amountFiltered={currentData.length} />
      }

      {/* Status bar is atop network etc  */}



      <StatusBar backgroundColor="black" barStyle="default" />
    </Body>
  );
}

export default MainScreen;