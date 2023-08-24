import { StyleSheet } from "react-native"
import { styled } from "styled-components/native"
import React, { useCallback, useEffect, useRef, useState } from "react"
import { colorPalette } from "../styles/styles"
import { ScrollView, TextInput, TouchableOpacity, TouchableWithoutFeedback } from "react-native-gesture-handler"
import { GenFilterSection } from "./filterMenuComponents/GenFilterSection"
import { TypesFilterSection } from "./filterMenuComponents/TypesFilterSection"
import HorizontalSlidingMenu from "../common/HorizontalSlidingMenu"
import { produce } from "immer"
import { useOnKeyboardShow } from "../hooks/useKeyboardHooks"
import { isEqual as deepEqual } from "lodash"
import { MegaFilter, PokeFilter, initialPokefilter } from "../common/pokeInfo"
import { OpacitySpawn } from "../common/common"

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

const IncludeMegasButton = styled(TouchableOpacity) <{ megaFilter: MegaFilter }>`
  margin-top: 5px;

  width: 120px;
  border-radius: 10px;
  background-color: ${p => p.megaFilter === MegaFilter.OnlyMega ? "#e8578e" : p.megaFilter === MegaFilter.IncludeMegas ? colorPalette.foregroundButtonBlackActive : colorPalette.foregroundButtonBlackInactive};
`



const FilteredCountWrapper = styled.View`
  width: 25%;
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

const BaseStatThresholdWrapper = styled.View`
  width: 90%;

  display: flex;
  flex-direction: row;

  align-items: center;

  margin-top: 10px;
`

const BaseStatTextDisplay = styled.Text`
  color: ${colorPalette.textWhite};

  font-size: 14px;
  margin-right: 5px;

  max-width: 40%;
`

const BaseStatThresholdOperatorDisplayWrapper = styled.View`
  width: 50px;
  height: 40px;

  display: flex;

  justify-content: center;
  align-items: center;

  text-align: center;
  background-color: ${colorPalette.foregroundButtonBlackActive};

  border-radius: 10px;
`

const BaseStatThresholdOperatorDisplayText = styled.Text`
  color: ${colorPalette.textWhite};

  font-size: 35px;
  line-height: 35px;
`

const BaseStatThresholdInput = styled(TextInput)`
  /* padding-left: 15px; */

  color: white;
  background-color: ${colorPalette.foregroundButtonBlackInactive};

  border-radius: 15px;

  background-color: black;

  font-size: 20px;
  width: 80px;
  text-align: center;
`


const ClearFilterButtonWrapper = styled(OpacitySpawn)`
  position: absolute;

  left: 0;
  top: 0;


  border-radius: 10px;
  background-color: ${colorPalette.foregroundButtonBlackFull};

  margin: 5px;
`

const ClearFilterButtonText = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 15px;

  padding: 5px;
`

export type PokeFilterMenuProps = {
  currentFilter: PokeFilter,
  setCurrentFilter: React.Dispatch<React.SetStateAction<PokeFilter>>,

  dismissLayout: () => void,
  amountFiltered: number,
}

export function PokeFilterMenu({ currentFilter: currentGlobalAppliedFilter, setCurrentFilter: setCurrentGlobalAppliedFilter, dismissLayout, amountFiltered }: PokeFilterMenuProps) {
  const scrollRef = useRef<ScrollView>(null);

  const [currentFilter, setCurrentFilter] = useState<PokeFilter>(currentGlobalAppliedFilter);

  // const applyFilter = useCallback(() => {
  //   setCurrentGlobalAppliedFilter(currentFilter)
  // }, [currentFilter, setCurrentGlobalAppliedFilter])

  useEffect(() => {
    setCurrentGlobalAppliedFilter(currentFilter)
  }, [currentFilter, setCurrentGlobalAppliedFilter])

  useOnKeyboardShow(() => {
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false })
    }, 50)
  })

  const clearFilter = useCallback(() => {
    setCurrentFilter(initialPokefilter)
  }, [setCurrentFilter])

  const hasFilterChanged = !deepEqual(initialPokefilter, currentFilter);

  return (
    <HorizontalSlidingMenu
      menuViewportSize={68}
      slidingOrigin="right"
      dismissLayout={dismissLayout}
      contentContainerWrapperStyle={{ backgroundColor: colorPalette.backgroundBlack, padding: 10 }}
      overlayedComponent={
        <>
          <FilteredCountWrapper>
            <FilteredCountLiteralDisplay>
              Pokemon matching your search and filters
            </FilteredCountLiteralDisplay>
            <FilteredCountNumericalDisplay>
              {amountFiltered}
            </FilteredCountNumericalDisplay>
          </FilteredCountWrapper>
        </>
      }
    >

      <ScrollView contentContainerStyle={{ alignItems: "center" }} fadingEdgeLength={25}
        ref={scrollRef}
      >
        <FilterHeader>
          Filter Pokemon
        </FilterHeader>

        <HorizontalBottomRule />

        <FilterSectionHeader>
          Generation
        </FilterSectionHeader>
        <HorizontalBottomRule />

        <GenFilterSection {...{ currentFilter, setCurrentFilter }} />
        {/* <GenFilterSection {...{ currentFilter, setCurrentFilter }} /> */}


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

        <BaseStatThresholdWrapper>
          <BaseStatTextDisplay>
            Base Stat Threshold:
          </BaseStatTextDisplay>
          <BaseStatThresholdInput
            keyboardType="numeric"
            placeholder="0"
            caretHidden={false}
            onChangeText={(x: string) => {
              if (x.length > 3)
                return;

              if (x === "") {
                setCurrentFilter(prev => produce(prev, draft => { draft.baseStatThreshold = undefined }))
                return;
              }

              const parsed = parseInt(x, 10)
              if (Number.isNaN(parsed))
                return;

              if (parsed === 0) {
                setCurrentFilter(prev => produce(prev, draft => { draft.baseStatThreshold = undefined }))
                return;
              }

              setCurrentFilter(prev => produce(prev, draft => {
                draft.baseStatThreshold = parsed;
              }))
            }}
            value={`${currentFilter.baseStatThreshold ?? ""}`}
            defaultValue={""}
          />

          {
            currentFilter.baseStatThreshold !== undefined &&
            <TouchableWithoutFeedback
              style={{ marginLeft: 10 }}
              onPress={() => {
                setCurrentFilter(prev => produce(prev, draft => {
                  if (prev.baseStatThresholdOperator === "ge") {
                    draft.baseStatThresholdOperator = "le"
                  } else {
                    draft.baseStatThresholdOperator = "ge"
                  }
                }))
              }}>
              <BaseStatThresholdOperatorDisplayWrapper>
                <BaseStatThresholdOperatorDisplayText>
                  {currentFilter.baseStatThresholdOperator === "ge" ? "≥" : "≤"}
                </BaseStatThresholdOperatorDisplayText>
              </BaseStatThresholdOperatorDisplayWrapper>
            </TouchableWithoutFeedback>
          }

        </BaseStatThresholdWrapper>


      </ScrollView>

      {hasFilterChanged &&
        <ClearFilterButtonWrapper spawnDuration={200}>
          <TouchableOpacity style={{ backgroundColor: undefined }} onPress={clearFilter}>
            <ClearFilterButtonText>
              Clear Filters
            </ClearFilterButtonText>
          </TouchableOpacity>
        </ClearFilterButtonWrapper>}

    </HorizontalSlidingMenu>
  )
}