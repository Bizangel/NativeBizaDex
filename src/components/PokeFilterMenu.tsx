import { StyleSheet } from "react-native"
import { styled } from "styled-components/native"
import React from "react"
import { colorPalette } from "../styles/styles"
import { ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler"
import { GenFilterSection } from "./filterMenuComponents/GenFilterSection"
import { MegaFilter, PokeFilter } from "../util/filterPokemon"
import { TypesFilterSection } from "./filterMenuComponents/TypesFilterSection"
import HorizontalSlidingMenu from "../common/SlidingMenu"

const FilterHeader = styled.Text`
  font-size: 24px;

  color: ${colorPalette.textWhite};
`


const FilterSectionHeader = styled.Text`
  margin-top: 10px;

  font-size: 20px;
  color: ${colorPalette.textWhite};
`

const IncludeMegaText = styled.Text`
  font-size: 14px;
  color: ${colorPalette.textWhite};
  text-align: center;
  padding: 4px;
`

const IncludeMegasButton = styled(TouchableWithoutFeedback) <{ megaFilter: MegaFilter }>`
  margin-top: 5px;

  width: 120px;
  border-radius: 10px;
  background-color: ${p => p.megaFilter === MegaFilter.OnlyMega ? "#e8578e" : colorPalette.foregroundButtonBlackActive};

  opacity: ${p => p.megaFilter === MegaFilter.NoMega ? 0.3 : 1};
`



const FilteredCountWrapper = styled.View`
  width: 30%;
  position: absolute;

  top: 0;
  left: 0;

  margin-left: 2%;

  display: flex;

  align-items: center;
`

const FilteredCountLiteralDisplay = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 13px;

  text-align: center;
`

const FilteredCountNumericalDisplay = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 24px;
`


const HorizontalBottomRule = styled.View`
  width: 85%;
  border-color: ${colorPalette.textWhite};

  margin: 5px 0px;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
`


const BaseStatThresholdInput = styled.TextInput`
  font-size: 16px;
  padding-left: 15px;

  color: white;
`


export type PokeFilterMenuProps = {
  currentFilter: PokeFilter,
  setCurrentFilter: React.Dispatch<React.SetStateAction<PokeFilter>>,

  dismissLayout: () => void,
  amountFiltered: number,
}

export function PokeFilterMenu({ currentFilter, setCurrentFilter, dismissLayout, amountFiltered }: PokeFilterMenuProps) {

  return (
    <HorizontalSlidingMenu
      menuViewportSize={65}
      slidingOrigin="right"
      dismissLayout={dismissLayout}
      contentContainerWrapperStyle={{ backgroundColor: colorPalette.backgroundBlack, padding: 10 }}
      overlayedComponent={
        <FilteredCountWrapper>
          <FilteredCountLiteralDisplay>
            Pokemon matching your search and filters
          </FilteredCountLiteralDisplay>
          <FilteredCountNumericalDisplay>
            {amountFiltered}
          </FilteredCountNumericalDisplay>
        </FilteredCountWrapper>
      }
    >
      <ScrollView contentContainerStyle={{ alignItems: "center" }} fadingEdgeLength={25}>
        <FilterHeader>
          Filter Pokemon
        </FilterHeader>
        <HorizontalBottomRule />

        <FilterSectionHeader>
          Generation
        </FilterSectionHeader>
        <HorizontalBottomRule />

        <GenFilterSection {...{ currentFilter, setCurrentFilter }} />

        <FilterSectionHeader>
          Types
        </FilterSectionHeader>
        <HorizontalBottomRule />

        <TypesFilterSection {...{ currentFilter, setCurrentFilter }} />

        <FilterSectionHeader>
          Misc
        </FilterSectionHeader>
        <HorizontalBottomRule />

        <IncludeMegasButton megaFilter={currentFilter.displayMegas}
          onPress={() => {
            setCurrentFilter(prev => {
              // cycle
              if (prev.displayMegas === MegaFilter.IncludeMegas) {
                return {
                  ...prev,
                  displayMegas: MegaFilter.OnlyMega,
                }
              } else if (prev.displayMegas === MegaFilter.OnlyMega) {
                return {
                  ...prev,
                  displayMegas: MegaFilter.NoMega,
                }
              }
              return {
                ...prev,
                displayMegas: MegaFilter.IncludeMegas,
              }
            })
          }}>
          <IncludeMegaText>{currentFilter.displayMegas}</IncludeMegaText>
        </IncludeMegasButton>

        <BaseStatThresholdInput
          keyboardType="numeric"
          placeholder="Threshold"
          placeholderTextColor="#dddddd"
          onChangeText={(x: string) => { console.log("x") }}
          value={"Threshold"}
          defaultValue={""}
        />

      </ScrollView>
    </HorizontalSlidingMenu>
  )
}