import { StatusBar } from 'react-native';
import styled from 'styled-components/native'
import React, { useCallback, useState } from 'react';
import PokeDetails from '../components/PokeDetails';
import { colorPalette } from '../styles/styles';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import PokeFilterMenu from '../components/mainScreen/PokeFilterMenu';
import PokeSortingMenu from '../components/mainScreen/PokeSortingMenu';
import MainSidebar from '../components/mainScreen/MainSidebar';
import ScrollPokeDisplay from '../components/mainScreen/scrollPokeDisplay';
import useDisplayPreselectedPoke from '../actions/useDisplayPreselectedPoke';
import { useDebouncedPokeFilter } from '../actions/useDebouncedPokefilter';
import { usePokedataStore } from '../actions/pokedata';

const Body = styled.View`
  background-color: ${colorPalette.backgroundBlack};
  width: 100%;
  height: 100%;
`

function MainScreen(props: NativeStackScreenProps<RootStackParamList, 'MainScreen'>) {
  const preSelectedPoke = props.route.params.preSelectedPokemonId

  const selectedPokemon = usePokedataStore(e => e.selectedPokemon);

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSortingMenu, setShowSortingMenu] = useState(false);
  const [showMainSidebar, setShowMainSidebar] = useState(false);

  const onTopFilterPress = useCallback(() => { setShowFilterMenu(true); }, [setShowFilterMenu])
  const onBurgerBarPress = useCallback(() => { setShowMainSidebar(true); }, [setShowMainSidebar])
  const onSortingPress = useCallback(() => { setShowSortingMenu(true); }, [setShowSortingMenu])

  const onPreselectedPokeDisplay = useCallback(() => { setShowFilterMenu(false); setShowMainSidebar(false); }, [setShowFilterMenu, setShowMainSidebar])

  useDisplayPreselectedPoke(preSelectedPoke, onPreselectedPokeDisplay);
  useDebouncedPokeFilter();

  const dissmissPokeFilterMenu = useCallback(() => { setShowFilterMenu(false); }, [])
  const dissmissSortingMenu = useCallback(() => { setShowSortingMenu(false); }, [])
  const dismissMainSidebar = useCallback(() => { setShowMainSidebar(false); }, [])

  return (
    <Body>
      <ScrollPokeDisplay {...{ onTopFilterPress, onBurgerBarPress, onSortingPress }} />

      {
        selectedPokemon && <PokeDetails pokemon={selectedPokemon} />
      }

      {
        showFilterMenu && <PokeFilterMenu dismissLayout={dissmissPokeFilterMenu} />
      }

      {
        showSortingMenu && <PokeSortingMenu dismissLayout={dissmissSortingMenu} />
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