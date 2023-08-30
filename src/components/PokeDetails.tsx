import { styled } from "styled-components/native";
import { Pokemon } from "../types/Pokemon";
import { GestureDetector, Gesture, ScrollView, Directions, TouchableOpacity } from "react-native-gesture-handler";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Animated, Image } from "react-native";
import pokeImages from "../assets/pokeImages";
import { types2color } from "../styles/styles";
import PokeStatsDisplay from "./detailsComponents/PokestatsDisplay";
import { DexNameAndDescription } from "./detailsComponents/DexNameAndDescription";
import { useBackHandler } from "../hooks/useBackHandler";
import { AbilityDisplayBox } from "./detailsComponents/abilitiesDisplay";
import useActiveRoutes from "../hooks/useActiveRoutes";
import { EvoTreeDisplay } from "./detailsComponents/EvoTreeDisplay";
import PokeWeaknessDisplay from "./detailsComponents/PokeWeaknessDisplay";

const FullWrapper = styled(Animated.View)`
  position: absolute;
  top: 0%;
  left: 0;

  width: 100%;
  height: 100%;
`

const DetailsWrapper = styled(Animated.View)`
  position: relative;
  top: 35%;
  width: 100%;
  height: 65%;

  border-radius: 20px 20px 0px 0px;
`

const ScrollableDetailsWrapperBackground = styled(Animated.View)`
  width: 100%;
  height: 100%;

  border-radius: 20px 20px 0px 0px;
`

const ScrollableDetailsWrapperContent = styled(Animated.View)`
  position: relative;

  width: 100%;
  height: 100%;

  padding-top: 20%;
`

const ScrollableDetails = styled(ScrollView).attrs({
  contentContainerStyle: { alignItems: "center", paddingBottom: 15 }
})`
  width: 100%;
  height: 100%;



  display: flex;
  flex-direction: column;
`

const PokeImageWrapper = styled(Animated.View)`
  position: absolute;

  top: -50%;
  left: 5%;

  width: 90%;
  height: 70%;

  z-index: 1;
`

const ArrowButtonWrapper = styled.View`
  position: absolute;
  top: 10px;
  left: 15px;

  width: 35px;
  height: 40px;

  z-index: 2;
  /* opacity: 0.2; */

  border-radius: 20px;
`

const LeftButton = styled.Image`
  width: 100%;
  height: 100%;
`

const RightButton = styled(LeftButton)`
  transform: rotate(180deg);
`


const hideVelocityThreshold = 2; // how "hard" it needs to be dragged down for it to be hidden
const switchVelocityThreshold = 1.5;

const switchAnimDurationMs = 350;


export function PokeDetails({ pokemon, setSelectedPokemon, fullDataRef, dataIdx }: {
  pokemon: Pokemon, setSelectedPokemon: (x: Pokemon | null) => void,
  fullDataRef: Pokemon[],
  dataIdx: number,
}) {
  // used only for anim purposes
  const [pokeSwitchInfo, setPokeSwitchInfo] = useState<{ originPokeColor: string, targetPokeColor: string } | null>(null);

  // animation regarding opening progress
  const animOpeningProgress = useRef(new Animated.Value(0)).current;
  const animatedTop = animOpeningProgress.interpolate({ inputRange: [0, 100], outputRange: ["130%", "35%"] });
  const animatedBackgroundOpacity = animOpeningProgress.interpolate({ inputRange: [0, 100], outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,.8)'] });

  // animation regarding switching between pokes
  const isSwitchingAnimation = useRef(false);
  const animatedSwitchProgress = useRef(new Animated.Value(0)).current;
  const animatedSwitchOpacity = animatedSwitchProgress.interpolate({ inputRange: [0, 50, 100], outputRange: [1, 0, 1] })
  const animatedSwitchColor = animatedSwitchProgress.interpolate({
    inputRange: [0, 100],
    outputRange: pokeSwitchInfo ? [pokeSwitchInfo.originPokeColor, pokeSwitchInfo.targetPokeColor] :
      [types2color[pokemon.type[0]], types2color[pokemon.type[0]]] // if no switch info, just display normal pokemon color
  })

  // Performs open animation, once component is mounted for the first time.
  useEffect(() => {
    animatedSwitchProgress.setValue(100); // if mounting, skip switch animation
    Animated.timing(animOpeningProgress, {
      toValue: 100,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [animOpeningProgress, animatedSwitchProgress]);

  // Helper variable to detect when layout wants to be closed via drag.
  const dragStartY = useRef(0);

  const renderedScreens = useActiveRoutes().length;

  // Hide layout function that performs animation and then hides itself.
  const hideLayout = useCallback(() => {
    Animated.timing(animOpeningProgress, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setSelectedPokemon(null)
    });
  }, [animOpeningProgress, setSelectedPokemon])

  // make hide on back
  useBackHandler(() => {
    if (renderedScreens > 1)
      return false; // if more screen, ignore until just this one is available

    hideLayout();
    return true;
  })

  // func to Switch Currently Selected pokemon, applying proper animations
  const switchPoke = (newPoke: Pokemon) => {
    let newIdx = fullDataRef.map(e => e.id).indexOf(newPoke.id);
    if (newIdx === -1)
      newIdx = 0; // if for some reason doesn't exist, just choose first

    if (isSwitchingAnimation.current) {
      // skip anim make it instant if spamming
      setSelectedPokemon(newPoke);
      animatedSwitchProgress.setValue(100);
      isSwitchingAnimation.current = false;

      return;
    }

    isSwitchingAnimation.current = true;

    setPokeSwitchInfo({ originPokeColor: types2color[pokemon.type[0]], targetPokeColor: types2color[newPoke.type[0]] })
    animatedSwitchProgress.setValue(0);
    Animated.timing(animatedSwitchProgress, {
      toValue: 50, // go halfway
      duration: switchAnimDurationMs / 2,
      useNativeDriver: true,
    }).start(() => {
      // change poke
      setSelectedPokemon(newPoke);
      Animated.timing(animatedSwitchProgress, {
        toValue: 100, // finish anim
        duration: switchAnimDurationMs / 2,
        useNativeDriver: true,
      }).start(() => {
        isSwitchingAnimation.current = false;
      })
    });
  }

  const switchToNextPoke = () => { if (fullDataRef[dataIdx + 1]) switchPoke(fullDataRef[dataIdx + 1]) }
  const switchToPreviousPoke = () => { if (fullDataRef[dataIdx - 1]) switchPoke(fullDataRef[dataIdx - 1]) }

  // Hide layout when flinged downwards or background is tapped
  const backgroundTap = Gesture.Tap().onStart(() => { hideLayout(); })
  const detailsFling = Gesture.Fling().direction(Directions.DOWN).onStart(() => { hideLayout(); })

  // switch to next poke when flinged to the left
  // these work, but are too damn sensitive tbh
  // const nextFling = Gesture.Fling().direction(Directions.LEFT).onStart(() => { switchToNextPoke(); console.log("triggered sensitive left") })
  // same but for the right
  // const backFling = Gesture.Fling().direction(Directions.RIGHT).onStart(() => { switchToPreviousPoke(); console.log("triggered sensitive right") })

  // capture the tap, so it does't close when the overlay is clicked. (only when background)
  const captureTapFlick = Gesture.Tap().onStart(() => { });

  return (
    <GestureDetector gesture={backgroundTap}>
      <FullWrapper style={{ backgroundColor: animatedBackgroundOpacity }}>
        <GestureDetector gesture={Gesture.Race(detailsFling, captureTapFlick)}>
          <DetailsWrapper style={{
            top: animatedTop,
          }}>
            <ScrollableDetailsWrapperBackground style={{ backgroundColor: animatedSwitchColor }}>
              <ScrollableDetailsWrapperContent style={{ opacity: animatedSwitchOpacity }}>

                <PokeImageWrapper style={{ opacity: animatedSwitchOpacity }}>
                  <Image source={pokeImages[pokemon.id]} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
                </PokeImageWrapper>

                {
                  dataIdx > 0 &&
                  <ArrowButtonWrapper>
                    <TouchableOpacity activeOpacity={1} style={{ opacity: 0.5 }} onPress={switchToPreviousPoke}>
                      <LeftButton source={require('../icons/leftarrow.png')} resizeMode="contain" />
                    </TouchableOpacity>
                  </ArrowButtonWrapper>
                }

                {
                  dataIdx < fullDataRef.length - 1 &&
                  <ArrowButtonWrapper style={{ right: 10, left: undefined }}>
                    <TouchableOpacity activeOpacity={1} style={{ opacity: 0.5 }} onPress={switchToNextPoke}>
                      <RightButton source={require('../icons/leftarrow.png')} resizeMode="contain" />
                    </TouchableOpacity>
                  </ArrowButtonWrapper>
                }

                <ScrollableDetails
                  onScrollBeginDrag={(ev) => { dragStartY.current = ev.nativeEvent.contentOffset.y; }}
                  onScrollEndDrag={(ev) => {
                    if (dragStartY.current <= 0 && ev.nativeEvent.velocity && ev.nativeEvent.velocity.y >= hideVelocityThreshold)
                      hideLayout(); // if started from top, and dragging to close, then close

                    if (ev.nativeEvent.velocity
                      && Math.abs(ev.nativeEvent.velocity.x) >= switchVelocityThreshold // x needs to be big
                      && Math.abs(ev.nativeEvent.velocity.y) <= switchVelocityThreshold) { // but also y small

                      if (ev.nativeEvent.velocity.x < 0) {
                        switchToNextPoke();
                      } else {
                        switchToPreviousPoke();
                      }
                    }
                  }}
                  fadingEdgeLength={25}
                >

                  <DexNameAndDescription pokemon={pokemon} />
                  <PokeStatsDisplay stats={pokemon.baseStats} />
                  <AbilityDisplayBox abilitiesId={pokemon.abilitiesId}
                    hiddenAbilityId={pokemon.hiddenAbility} />
                  <EvoTreeDisplay pokemon={pokemon} switchPoke={switchPoke} />

                  <PokeWeaknessDisplay pokeTypes={pokemon.type} />

                </ScrollableDetails>
              </ScrollableDetailsWrapperContent>
            </ScrollableDetailsWrapperBackground>
          </DetailsWrapper>
        </GestureDetector>
      </FullWrapper >
    </GestureDetector>

  )
}