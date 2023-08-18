import { Animated, StyleSheet } from "react-native"
import { styled } from "styled-components/native"
import React, { useRef, useEffect } from "react"
import { colorPalette } from "../styles/styles"
import { Gesture, GestureDetector, TouchableOpacity } from "react-native-gesture-handler"
import { GenFilterSection } from "./filterMenuComponents/GenFilterSection"
import { PokeFilter } from "../util/filterPokemon"
import { useBackHandler } from "../hooks/useBackHandler"


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

  padding: 40px 20px;

  background-color: ${colorPalette.backgroundBlack};
`

const FilterHeader = styled.Text`
  font-size: 24px;

  color: ${colorPalette.textWhite};
`


const FilterSectionHeader = styled.Text`

  font-size: 20px;

  color: ${colorPalette.textWhite};
`

const CloseButtonWrapper = styled.View`
  width: 25px;
  height: 25px;
  position: absolute;

  margin-left: 20px;
  margin-top: 10px;

  top: 0px;
  left: 0px;
`

const CloseButtonImage = styled.Image`
  width: 100%;
  height: 100%;
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

  const backgroundTapAvoidCaptureEmptyTap = Gesture.Tap();

  return (
    <GestureDetector gesture={backgroundTapCloseGesture}>
      <FullFilterOverlayWrapper style={{ backgroundColor: animatedBackgroundOpacity }}>
        <GestureDetector gesture={backgroundTapAvoidCaptureEmptyTap}>
          <FilterWrapper style={{ right: animatedRightProp }}>

            <CloseButtonWrapper>
              <TouchableOpacity onPress={hideLayoutAnimated}>
                <CloseButtonImage source={require('../icons/cross.png')} resizeMode="contain" />
              </TouchableOpacity>
            </CloseButtonWrapper>

            <FilterHeader>
              Filter Pokemon
            </FilterHeader>
            <HorizontalBottomRule />

            <FilterSectionHeader>
              Generation
            </FilterSectionHeader>
            <HorizontalBottomRule />

            <GenFilterSection {...{ currentFilter, setCurrentFilter }} />


          </FilterWrapper>
        </GestureDetector>
      </FullFilterOverlayWrapper>
    </GestureDetector>

  )
}