import { styled } from "styled-components/native"
import { colorPalette } from "../../styles/styles"
import TopBar from "./TopBar"
import { useCallback, useEffect, useRef, memo, useState, useMemo } from "react"
import { useWindowDimensions, Animated } from "react-native"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { Pokemon } from "../../types/Pokemon"
import PokeCard from "../PokeCard"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { initialPokefilter } from "../../common/pokeInfo"
import { isEqual as deepEqual } from "lodash"
import { usePokedataStore } from "../../actions/pokedata"
import { topBarHeightPx } from "../../common/common"
import { useFlashlistScrollSyncFasthandle } from "../../hooks/useFlashlistScrollSyncFasthandle"
import usePersistentActiveDex from "../../hooks/usePersistentActiveDex"

const FlatListWrapper = styled.View`
  justify-content: center;
  flex-grow: 1;
  background-color: ${colorPalette.backgroundBlack};
`

const draggableScrollbarHeight = 70;

/** Idea is that there's an empty draggable div across the right side of the screen. And it is transformed every time the thing changes. */
const DraggableScrollbar = styled(Animated.View) <{ isBeingDragged: boolean }>`
  position: absolute;

  background-color: ${p => p.isBeingDragged ? "rgba(255,255,255,0.5)" : "rgba(255,255,255,0)"};

  right: 0;

  height: ${draggableScrollbarHeight}px;

  width: ${p => p.isBeingDragged ? "20px" : "20px"};
  border-radius: 10px;
`

const EmptyDisplay = styled.Text`
  height: 80%;
  text-align: center;
  color: ${colorPalette.textWhite};
  padding: 7%;

  font-size: 20px;
`

export type ScrollPokeDisplayProps = {
  onBurgerBarPress: () => void,
  onTopFilterPress: () => void,
  onSortingPress: () => void,
}


// this will be re-rendering due to scroll so keep that in mind due to performance reasons
function ScrollPokeDisplay({ onBurgerBarPress, onTopFilterPress, onSortingPress }: ScrollPokeDisplayProps) {
  const { width: screenWidth } = useWindowDimensions();

  const currentlyFilteredPokemon = usePokedataStore(e => e.currentFilteredPokemon);
  const currentPokefilter = usePokedataStore(e => e.currentPokeFilter);
  const setCurrentlySelectedpokemon = usePokedataStore(e => e.setSelectedPokemon);
  const updateCurrentSearchFilter = usePokedataStore(e => e.setTextSearchPokefilter);
  const selectedPokemon = usePokedataStore(e => e.selectedPokemon);

  const flashListRef = useRef<FlashList<Pokemon>>(null);
  const [isDraggingFastScroll, setIsDraggingFastScroll] = useState(false);
  const scrollTopValue = useRef(new Animated.Value(topBarHeightPx)).current;

  const caughtPokemonFromStorage = usePersistentActiveDex(e => e.caughtPokemon);

  const caughtPokemonIds = useMemo(() => caughtPokemonFromStorage ? new Set(Object.keys(caughtPokemonFromStorage)) : null, [caughtPokemonFromStorage]);

  // every time pokedex changes, the re-render does too!
  const renderPokecard: ListRenderItem<Pokemon> = useCallback(({ item }) => {
    // @ts-ignore // this is too complex for some reason?
    return <PokeCard pokemon={item} onPress={setCurrentlySelectedpokemon} caught={caughtPokemonIds?.has(item.id)} />;
  }, [setCurrentlySelectedpokemon, caughtPokemonIds])

  // every time filter changes, scroll to top
  useEffect(() => {
    flashListRef.current?.scrollToIndex({ animated: true, index: 0 })
  }, [currentlyFilteredPokemon])

  const hasFilterChangedExceptSearch = !deepEqual(currentPokefilter, { ...initialPokefilter, searchString: currentPokefilter.searchString });

  // automatically scroll to selected pokemon, should it be available in the list
  useEffect(() => {
    if (!selectedPokemon)
      return;

    const foundIndex = currentlyFilteredPokemon.map(e => e.id).indexOf(selectedPokemon.id)
    if (foundIndex !== -1)
      flashListRef.current?.scrollToIndex({ animated: true, index: foundIndex, viewPosition: 0 });
  }, [selectedPokemon, currentlyFilteredPokemon])

  const { onDraggableFastScrollHandlePan, onFlashlistScroll } = useFlashlistScrollSyncFasthandle(flashListRef, isDraggingFastScroll, draggableScrollbarHeight, scrollTopValue, currentlyFilteredPokemon.length);

  const draggableScrollbarGesture = Gesture.Pan()
    .onBegin(() => { setIsDraggingFastScroll(true); })
    .onUpdate(onDraggableFastScrollHandlePan)
    .onEnd(() => {
      setIsDraggingFastScroll(false);
    });

  return (
    <FlatListWrapper>
      <TopBar currentSearch={currentPokefilter.searchString} setCurrentSearch={updateCurrentSearchFilter}
        onSortingPress={onSortingPress}
        onFilterPress={onTopFilterPress}
        onBurgerBarPress={onBurgerBarPress}
        displayFilterIndicator={hasFilterChangedExceptSearch} />
      <FlashList
        showsVerticalScrollIndicator={!isDraggingFastScroll}
        ref={flashListRef}
        onScroll={onFlashlistScroll}
        numColumns={2}
        estimatedItemSize={screenWidth / 2}
        renderItem={renderPokecard}
        data={currentlyFilteredPokemon}
        extraData={[updateCurrentSearchFilter, onTopFilterPress]} // basically, dependency props of flatlist
      />

      {
        currentlyFilteredPokemon.length === 0 &&
        <EmptyDisplay>
          No pokemon match your current query. Try adjusting your search / filter.
        </EmptyDisplay>
      }

      <GestureDetector gesture={draggableScrollbarGesture}>
        <DraggableScrollbar style={{ top: scrollTopValue }}
          isBeingDragged={isDraggingFastScroll}
        />
      </GestureDetector>

    </FlatListWrapper>
  )
}

export default memo(ScrollPokeDisplay) as typeof ScrollPokeDisplay