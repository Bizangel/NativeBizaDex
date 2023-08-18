import { Animated, StyleSheet } from "react-native"
import { styled } from "styled-components/native"
import React, { useRef, useEffect } from "react"
import { colorPalette } from "../styles/styles"
import { Directions, Gesture, GestureDetector, ScrollView, TouchableWithoutFeedback } from "react-native-gesture-handler"
import { GenFilterSection } from "./filterMenuComponents/GenFilterSection"
import { MegaFilter, PokeFilter } from "../util/filterPokemon"
import { useBackHandler } from "../hooks/useBackHandler"
import { TypesFilterSection } from "./filterMenuComponents/TypesFilterSection"

const FullFilterOverlayWrapper = styled(Animated.View)`
  position: absolute;
  width: 100%;
  height: 100%;

  top: 0px;
  left: 0px;
`

const FilterWrapper = styled(Animated.View)`
  position: absolute;
  top: 0px;

  width: 60%;
  height: 100%;

  padding: 20px;

  background-color: ${colorPalette.backgroundBlack};
`

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


export const HorizontalBottomRule = styled.View`
  width: 85%;
  border-color: ${colorPalette.textWhite};

  margin: 5px 0px;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
`

const openingAnimationDurationMs = 250;


export type PokeFilterMenuProps = {
  currentFilter: PokeFilter,
  setCurrentFilter: React.Dispatch<React.SetStateAction<PokeFilter>>,

  dismissLayout: () => void,
}

export function PokeFilterMenu({ currentFilter, setCurrentFilter, dismissLayout }: PokeFilterMenuProps) {
  // animation regarding opening progress
  const animOpeningProgress = useRef(new Animated.Value(0)).current;
  const animatedRightProp = animOpeningProgress.interpolate({ inputRange: [0, 100], outputRange: ["-65%", "0%"] });
  const animatedBackgroundOpacity = animOpeningProgress.interpolate({ inputRange: [0, 100], outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,.8)'] });

  useBackHandler(() => {
    hideLayoutAnimated();
    return true;
  })

  useEffect(() => {
    Animated.timing(animOpeningProgress, {
      toValue: 100,
      duration: openingAnimationDurationMs,
      useNativeDriver: false,
    }).start(() => {

    });
  })

  const hideLayoutAnimated = () => {
    Animated.timing(animOpeningProgress, {
      toValue: 0,
      duration: openingAnimationDurationMs, // just do reverse
      useNativeDriver: false,
    }).start(() => {
      dismissLayout(); // fully close
    });
  }

  const backgroundTapCloseGesture = Gesture.Tap().onStart(() => {
    hideLayoutAnimated();
  });

  const closeFlingToRightGesture = Gesture.Fling().direction(Directions.RIGHT).onStart(() => hideLayoutAnimated())

  const backgroundTapAvoidCaptureEmptyTap = Gesture.Tap();

  return (
    <GestureDetector gesture={backgroundTapCloseGesture}>
      <FullFilterOverlayWrapper style={{ backgroundColor: animatedBackgroundOpacity }}>
        <GestureDetector gesture={Gesture.Race(backgroundTapAvoidCaptureEmptyTap, closeFlingToRightGesture)}>
          <FilterWrapper style={{ right: animatedRightProp }}>
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

            </ScrollView>
          </FilterWrapper>
        </GestureDetector>
      </FullFilterOverlayWrapper>
    </GestureDetector>

  )
}