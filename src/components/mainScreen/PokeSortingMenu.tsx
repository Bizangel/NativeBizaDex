import { StyleSheet } from "react-native"
import { styled } from "styled-components/native"
import React, { useCallback } from "react"
import { colorPalette } from "../../styles/styles"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import DirectionalSlidingMenu from "../../common/DirectionalSlidingMenu"
import { PokeSortKey } from "../../common/pokeInfo"
import { usePokedataStore } from "../../actions/pokedata"
import { ascendingFilterIcon2Image } from "../../common/common"

const FilterHeader = styled.Text`
  font-size: 24px;

  color: ${colorPalette.textWhite};
`

const SortByButtonText = styled.Text`
  font-size: 14px;
  color: ${colorPalette.textWhite};
  text-align: center;
  padding: 4px;
`

const SortByButton = styled(TouchableOpacity) <{ isSelected: boolean }>`
  margin-top: 10px;

  width: 120px;
  border-radius: 10px;
  background-color: ${p => p.isSelected ? colorPalette.foregroundButtonBlackActive : colorPalette.foregroundButtonBlackInactive};
`


const AscendingDescendingButton = styled(TouchableOpacity)`
  margin-top: 30px;

  display: flex;
  flex-direction: row;

  align-items: center;

  background-color: ${colorPalette.foregroundButtonBlackActive};
  border-radius: 15px;
  padding: 10px;
`

const AscendingDescendingButtonImage = styled.Image`
  width: 30px;
  height: 30px;
`

const AscendingDescendingButtonText = styled.Text`
  margin-left: 15px;

  color: ${colorPalette.textWhite};
  font-size: 15px;
`

const HorizontalBottomRule = styled.View`
  width: 85%;
  border-color: ${colorPalette.textWhite};

  margin: 5px 0px;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
`

function SortByButtonComponent({ sortKey, isActive, onPress }: { sortKey: PokeSortKey, isActive: boolean, onPress: (key: PokeSortKey) => void }) {
  return (
    <SortByButton isSelected={isActive} onPress={() => { onPress(sortKey) }}>
      <SortByButtonText>Sort By {sortKey}</SortByButtonText>
    </SortByButton>
  )
}

function PokeSortingMenu({ dismissLayout }: { dismissLayout: () => void }) {
  const currentSorting = usePokedataStore(e => e.currentSorting);
  const setSortingKey = usePokedataStore(e => e.setCurrentSortingKey);
  const toggleAscending = usePokedataStore(e => e.toggleAscendingSorting);
  const onSortButtonPress = useCallback((key: PokeSortKey) => { setSortingKey(key) }, [setSortingKey])

  return (
    <DirectionalSlidingMenu
      menuViewportSize={45}
      slidingOrigin="right"
      dismissLayout={dismissLayout}
      contentContainerWrapperStyle={{ backgroundColor: colorPalette.backgroundBlack, padding: 10 }}
    >
      <ScrollView contentContainerStyle={{ alignItems: "center" }} fadingEdgeLength={25}
      // ref={scrollRef}
      >
        <FilterHeader>
          Sort Pokemon
        </FilterHeader>

        <HorizontalBottomRule />

        {Object.values(PokeSortKey).map(e =>
          <SortByButtonComponent sortKey={e} isActive={currentSorting.sortKey === e} onPress={onSortButtonPress} key={e} />
        )}


        <AscendingDescendingButton onPress={toggleAscending}>
          <AscendingDescendingButtonImage source={ascendingFilterIcon2Image(currentSorting.ascending)} />
          <AscendingDescendingButtonText>{currentSorting.ascending ? "Ascending" : "Descending"}</AscendingDescendingButtonText>
        </AscendingDescendingButton>

      </ScrollView>
    </DirectionalSlidingMenu >
  )
}

export default React.memo(PokeSortingMenu) as typeof PokeSortingMenu;