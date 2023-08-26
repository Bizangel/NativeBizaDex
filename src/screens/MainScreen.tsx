import { StatusBar } from 'react-native';
import { Pokemon } from '../types/Pokemon';
import styled from 'styled-components/native'
import React, { useCallback, useState, useEffect } from 'react';
import { filterPokemon } from '../util/filterPokemon';
import { PokeDetails } from '../components/PokeDetails';
import { colorPalette } from '../styles/styles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { PokeFilter, allPokemon, initialPokefilter, pokeMapping } from '../common/pokeInfo';
import { PokeFilterMenu } from '../components/PokeFilterMenu';

import MainSidebar from '../components/MainSidebar';
import ScrollPokeDisplay from '../components/mainScreen/scrollPokeDisplay';

const Body = styled.View`
  background-color: ${colorPalette.backgroundBlack};
  width: 100%;
  height: 100%;
`

const MemoPokeFilterMenu = React.memo(PokeFilterMenu)
const MemodPokedetails = React.memo(PokeDetails)

const debounceDelay = 200;

function MainScreen(props: NativeStackScreenProps<RootStackParamList, 'MainScreen'>) {
  const preSelectedPoke = props.route.params.preSelectedPokemonId
  const [currentFilter, setCurrentFilter] = useState<PokeFilter>(initialPokefilter)
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null)
  const [currentData, setCurrentData] = useState<Pokemon[]>(allPokemon);

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showMainSidebar, setShowMainSidebar] = useState(false);

  const onTopFilterPress = useCallback(() => {
    setShowFilterMenu(true);
  }, [setShowFilterMenu])

  const onBurgerBarPress = useCallback(() => {
    setShowMainSidebar(true);
  }, [setShowMainSidebar])

  useEffect(() => {
    setSelectedPokemon(null);

    const timeout = setTimeout(() => {
      if (!preSelectedPoke)
        return;

      const foundPoke = pokeMapping.get(preSelectedPoke)
      if (!foundPoke)
        return;

      // if displaying new poke remove any oevrlays that might be present
      setShowFilterMenu(false);
      setShowMainSidebar(false);
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

  const dissmissPokeFilterMenu = useCallback(() => {
    setShowFilterMenu(false);
  }, [])

  const dismissMainSidebar = useCallback(() => {
    setShowMainSidebar(false);
  }, [])

  return (
    <Body>
      <ScrollPokeDisplay
        {...{ onTopFilterPress, onBurgerBarPress, setSelectedPokemon, currentFilter, setCurrentFilter, currentData, selectedPokemon }} />


      {selectedPokemon && <MemodPokedetails pokemon={selectedPokemon} setSelectedPokemon={setSelectedPokemon}
        fullDataRef={currentData}
        dataIdx={currentData.findIndex(e => selectedPokemon.id === e.id) ?? 0}
      />

      }

      {
        showFilterMenu && <MemoPokeFilterMenu currentFilter={currentFilter} setCurrentFilter={setCurrentFilter} dismissLayout={dissmissPokeFilterMenu} amountFiltered={currentData.length} />
      }

      {
        showMainSidebar && <MainSidebar dissmissMenu={dismissMainSidebar} />
      }

      {/* Status bar is atop network etc  */}



      <StatusBar backgroundColor="black" barStyle="default" />
    </Body>
  );
}

export default MainScreen;