import { styled } from "styled-components/native"
import { colorPalette } from "../../styles/styles"
import TopBar from "../TopBar"
import { useCallback, useEffect, useRef, memo, useState } from "react"
import { useWindowDimensions, Animated, NativeSyntheticEvent, NativeScrollEvent } from "react-native"
import { FlashList, ListRenderItem } from "@shopify/flash-list"
import { Pokemon } from "../../types/Pokemon"
import PokeCard from "../PokeCard"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import { PokeFilter, initialPokefilter } from "../../common/pokeInfo"
import { isEqual as deepEqual } from "lodash"
import { clamp } from "../../util/utils"

const FlatListWrapper = styled.View`
  justify-content: center;
  flex-grow: 1;
  background-color: ${colorPalette.backgroundBlack};
`

const draggableScrollbarHeight = 20;

/** Idea is that there's an empty draggable div across the right side of the screen. And it is transformed every time the thing changes. */
const DraggableScrollbar = styled(Animated.View) <{ isBeingDragged: boolean }>`
  position: absolute;

  /* background-color: ${p => p.isBeingDragged ? "green" : "rgba(255,255,255,0.3)"}; */
  background-color: rgba(255,255,255,0.3);
  right: 0;

  height: ${draggableScrollbarHeight}px;

  width: 200px;
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


const topBarHeightPx = 50;


// this will be re-rendering due to scroll so keep that in mind due to performance reasons
function ScrollPokeDisplay({
  currentFilter, setCurrentFilter, currentData,
  selectedPokemon, setSelectedPokemon,
  onBurgerBarPress, onTopFilterPress
}: ScrollPokeDisplayProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const flashListRef = useRef<FlashList<Pokemon>>(null);
  const [isDraggingFastScroll, setIsDraggingFastScroll] = useState(false);
  const scrollTopValue = useRef(new Animated.Value(topBarHeightPx)).current; // Initial value for opacity: 0
  // const fastScrollablePositionPercent = fastScrollablePositionValue.interpolate({ inputRange: [0, 1], outputRange: ["0%", "100%"] })

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
    flashListRef.current?.scrollToIndex({ animated: true, index: 0 })
  }, [currentFilter])

  const onNormalFlashListScroll = useCallback((ev: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (isDraggingFastScroll) // no need to sync
      return;

    // TODO properly sync. need to verify both normal scrolling and dragging scrolling. (Test with small list like 100 pokes fire pokes)

    // // ev.nativeEvent.contentOffset.
    const scrollProgress = ev.nativeEvent.contentOffset.y / ev.nativeEvent.contentSize.height;
    scrollTopValue.setValue(scrollProgress * (ev.nativeEvent.layoutMeasurement.height + topBarHeightPx))
  }, [isDraggingFastScroll])


  // automatically scroll to selected pokemon, should it be available in the list
  // if not available, well we don't really care.
  useEffect(() => {
    if (!selectedPokemon)
      return;

    const foundIndex = currentData.map(e => e.id).indexOf(selectedPokemon.id)
    if (foundIndex !== -1)
      flashListRef.current?.scrollToIndex({ animated: true, index: foundIndex, viewPosition: 0 });
  }, [selectedPokemon, currentData])

  const draggableScrollbarGesture = Gesture.Pan().onBegin(() => {
    setIsDraggingFastScroll(true);
  }).onUpdate((e) => {
    const scrollVal = clamp(e.absoluteY, topBarHeightPx, screenHeight - draggableScrollbarHeight) - topBarHeightPx; // from 0 - scrollview height
    const scrollProgress = scrollVal / (screenHeight - draggableScrollbarHeight);
    const scrollToIndex = Math.round(scrollProgress * (currentData.length - 1));

    scrollTopValue.setValue(scrollVal + topBarHeightPx);

    // scroll properly
    flashListRef.current?.scrollToIndex({ animated: false, index: scrollToIndex })
  }).onEnd(() => {
    setIsDraggingFastScroll(false);
  });


  return (
    <FlatListWrapper>
      <TopBar currentSearch={currentFilter.searchString} setCurrentSearch={updateCurrentSearchFilter}
        onFilterPress={onTopFilterPress}
        onBurgerBarPress={onBurgerBarPress}
        displayFilterIndicator={hasFilterChangedExceptSearch} />
      <FlashList
        ref={flashListRef}
        onScroll={onNormalFlashListScroll}
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
        <DraggableScrollbar style={{ top: scrollTopValue }} isBeingDragged={isDraggingFastScroll} />
      </GestureDetector>

    </FlatListWrapper>
  )
}

export default memo(ScrollPokeDisplay) as typeof ScrollPokeDisplay