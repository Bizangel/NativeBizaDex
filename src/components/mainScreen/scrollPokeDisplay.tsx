import { styled } from "styled-components/native"
import { colorPalette } from "../../styles/styles"
import TopBar from "../TopBar"
import { useCallback, useEffect, useRef, memo } from "react"
import { useWindowDimensions } from "react-native"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { Pokemon } from "../../types/Pokemon"
import PokeCard from "../PokeCard"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { PokeFilter, initialPokefilter } from "../../common/pokeInfo"
import { isEqual as deepEqual } from "lodash"

const FlatListWrapper = styled.View`
  justify-content: center;
  flex-grow: 1;
  background-color: ${colorPalette.backgroundBlack};
`

const DraggableScrollbar = styled.View`
  position: absolute;

  background-color: blue;
  right: 0;
  top: 100px;

  width: 200px;
  height: 100px;
`

const EmptyDisplay = styled.Text`
  height: 80%;
  text-align: center;
  color: ${colorPalette.textWhite};
  padding: 7%;

  font-size: 20px;
`

export type ScrollPokeDisplayProps = {
  currentFilter: PokeFilter,
  setCurrentFilter: React.Dispatch<React.SetStateAction<PokeFilter>>,

  selectedPokemon: Pokemon | null,
  setSelectedPokemon: React.Dispatch<React.SetStateAction<Pokemon | null>>,

  onBurgerBarPress: () => void,
  onTopFilterPress: () => void,

  currentData: Pokemon[],
}

// this will be re-rendering due to scroll so keep that in mind due to performance reasons
function ScrollPokeDisplay({
  currentFilter, setCurrentFilter, currentData,
  selectedPokemon, setSelectedPokemon,
  onBurgerBarPress, onTopFilterPress
}: ScrollPokeDisplayProps) {
  const screenWidth = useWindowDimensions().width;
  const flatListRef = useRef<FlashList<Pokemon>>(null);

  const renderPokecard: ListRenderItem<Pokemon> = useCallback(({ item }) => {
    // @ts-ignore // this is too complex for some reason?
    return <PokeCard pokemon={item} setSelectedPokemon={setSelectedPokemon} />;
  }, [setSelectedPokemon])

  const updateCurrentSearchFilter = useCallback((x: string) => {
    setCurrentFilter(e => { return { ...e, searchString: x } })
  }, [setCurrentFilter])

  const hasFilterChangedExceptSearch = !deepEqual(currentFilter, { ...initialPokefilter, searchString: currentFilter.searchString });

  // every time filter changes, scroll to top
  useEffect(() => {
    flatListRef.current?.scrollToIndex({ animated: true, index: 0 })
  }, [currentFilter])

  // automatically scroll to selected pokemon, should it be available in the list
  // if not available, well we don't really care.
  useEffect(() => {
    if (!selectedPokemon)
      return;

    const foundIndex = currentData.map(e => e.id).indexOf(selectedPokemon.id)
    if (foundIndex !== -1)
      flatListRef.current?.scrollToIndex({ animated: true, index: foundIndex, viewPosition: 0 });
  }, [selectedPokemon, currentData])

  const draggableScrollbarGesture = Gesture.Pan().onBegin((e) => {
    console.log("begin: ", e.absoluteY)
  }).onUpdate((e) => {
    console.log("update", e.absoluteY)
  });

  return (
    <FlatListWrapper>
      <TopBar currentSearch={currentFilter.searchString} setCurrentSearch={updateCurrentSearchFilter}
        onFilterPress={onTopFilterPress}
        onBurgerBarPress={onBurgerBarPress}
        displayFilterIndicator={hasFilterChangedExceptSearch} />
      <FlashList
        ref={flatListRef}
        numColumns={2}
        estimatedItemSize={screenWidth / 2}
        renderItem={renderPokecard}
        data={currentData}
        extraData={[updateCurrentSearchFilter, onTopFilterPress]} // basically, dependency props of flatlist
      />

      {
        currentData.length === 0 &&
        <EmptyDisplay>
          No pokemon match your current query. Try adjusting your search / filter.
        </EmptyDisplay>
      }

      <GestureDetector gesture={draggableScrollbarGesture}>
        <DraggableScrollbar />
      </GestureDetector>

    </FlatListWrapper>
  )
}

export default memo(ScrollPokeDisplay) as typeof ScrollPokeDisplay