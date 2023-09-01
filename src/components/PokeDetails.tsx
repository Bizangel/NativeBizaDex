import { styled } from "styled-components/native";
import { Pokemon } from "../types/Pokemon";
import { Gesture, GestureDetector, ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import React, { useCallback, useRef, useState, useMemo } from "react";
import { Animated, Image } from "react-native";
import pokeImages from "../assets/pokeImages";
import { types2color } from "../styles/styles";
import PokeStatsDisplay from "./detailsComponents/PokestatsDisplay";
import { DexNameAndDescription } from "./detailsComponents/DexNameAndDescription";
import { AbilityDisplayBox } from "./detailsComponents/abilitiesDisplay";
import { EvoTreeDisplay } from "./detailsComponents/EvoTreeDisplay";
import PokeWeaknessDisplay from "./detailsComponents/PokeWeaknessDisplay";
import { usePokedataStore } from "../actions/pokedata";
import DirectionalSlidingMenu, { DirectionalSlidingMenuRef } from "../common/DirectionalSlidingMenu";
import { usePersistentStorage } from "../localstore/storage";
import { caughtNotCaughtToIconImage } from "../common/common";

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


const CaughtIndicator = styled.View`
  position: absolute;
  width: 80px;
  height: 80px;

  /* background-color: blue; */
  border-radius: 10px;

  margin: 10px;
  top: 0;
  right: 0;
  opacity: 1;
`

const hideVelocityThreshold = 2; // how "hard" it needs to be dragged down for it to be hidden
const switchVelocityThreshold = 1.5;
const switchAnimDurationMs = 350;

function PokeDetails({ pokemon }: { pokemon: Pokemon }) {
  const setSelectedPokemon = usePokedataStore(e => e.setSelectedPokemon);
  const currentFilteredPokemon = usePokedataStore(e => e.currentFilteredPokemon);
  const dataIdx = useMemo(() => currentFilteredPokemon.findIndex(e => e.id === pokemon.id) ?? 0, [currentFilteredPokemon, pokemon])

  const slidingRef = useRef<DirectionalSlidingMenuRef>(null);
  const isPokemonCaught = usePersistentStorage(e => e.activePokedexIndex !== null ? (pokemon.id in e.allStoredPokedexes[e.activePokedexIndex].caughtPokemon) : false);
  const togglePokecapturedStorage = usePersistentStorage(e => e.togglePokemonCaptured);
  const togglePokemonCaptureState = useCallback(() => { togglePokecapturedStorage(pokemon.id) }, [pokemon.id, togglePokecapturedStorage]);

  // used only for anim purposes
  const [pokeSwitchInfo, setPokeSwitchInfo] = useState<{ originPokeColor: string, targetPokeColor: string } | null>(null);

  // animation regarding switching between pokes
  const isSwitchingAnimation = useRef(false);
  const animatedSwitchProgress = useRef(new Animated.Value(0)).current;
  const animatedSwitchOpacity = animatedSwitchProgress.interpolate({ inputRange: [0, 50, 100], outputRange: [1, 0, 1] })
  const animatedSwitchColor = animatedSwitchProgress.interpolate({
    inputRange: [0, 100],
    outputRange: pokeSwitchInfo ? [pokeSwitchInfo.originPokeColor, pokeSwitchInfo.targetPokeColor] :
      [types2color[pokemon.type[0]], types2color[pokemon.type[0]]] // if no switch info, just display normal pokemon color
  })


  const dissmissLayout = useCallback(() => { setSelectedPokemon(null); }, [setSelectedPokemon])
  // Helper variable to detect when layout wants to be closed via drag.
  const dragStartY = useRef(0);

  // Hide layout function that performs animation and then hides itself.
  const hideLayoutAnimated = useCallback(() => { slidingRef.current?.closeOverlay(); }, [slidingRef])

  // func to Switch Currently Selected pokemon, applying proper animations
  const switchPoke = (newPoke: Pokemon) => {
    let newIdx = currentFilteredPokemon.map(e => e.id).indexOf(newPoke.id);
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

  const switchToNextPoke = () => { if (currentFilteredPokemon[dataIdx + 1]) switchPoke(currentFilteredPokemon[dataIdx + 1]) }
  const switchToPreviousPoke = () => { if (currentFilteredPokemon[dataIdx - 1]) switchPoke(currentFilteredPokemon[dataIdx - 1]) }
  const onEvotreeCardPress = (x: Pokemon) => { if (pokemon.id !== x.id) switchPoke(x); }

  const onPokeballPress = Gesture.Tap().onStart(togglePokemonCaptureState)

  return (
    <DirectionalSlidingMenu
      dismissLayout={dissmissLayout}
      slidingOrigin="bottom"
      menuViewportSize={65}
      extraOverflowSize={25}
      ref={slidingRef}
      overlayedComponent={
        <>

          <CaughtIndicator>
            <GestureDetector gesture={onPokeballPress}>
              <TouchableOpacity>
                <Image source={caughtNotCaughtToIconImage(isPokemonCaught)}
                  resizeMode="contain" style={{ width: "100%", height: "100%" }} />
              </TouchableOpacity>
            </GestureDetector>
          </CaughtIndicator>


        </>
      }
    >
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
            dataIdx < currentFilteredPokemon.length - 1 &&
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
                hideLayoutAnimated(); // if started from top, and dragging to close, then close

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

            <PokeWeaknessDisplay pokeTypes={pokemon.type} />

            <AbilityDisplayBox abilitiesId={pokemon.abilitiesId}
              hiddenAbilityId={pokemon.hiddenAbility} />
            <EvoTreeDisplay pokemon={pokemon} onPokecardPress={onEvotreeCardPress} />
          </ScrollableDetails>
        </ScrollableDetailsWrapperContent>
      </ScrollableDetailsWrapperBackground>
    </DirectionalSlidingMenu>
  )
}

export default React.memo(PokeDetails) as typeof PokeDetails;