import { styled } from "styled-components/native";
import { Pokemon } from "../types/Pokemon";
import { GestureDetector, Gesture, ScrollView, Directions } from "react-native-gesture-handler";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Image } from "react-native";
import pokeImages from "../assets/pokeImages";
import { types2color } from "../styles/styles";
import PokeStatsDisplay from "./detailsComponents/PokestatsDisplay";
import { DexNameAndDescription } from "./detailsComponents/DexNameAndDescription";
import { useBackHandler } from "../hooks/useBackHandler";
import { AbilityDisplayBox } from "./detailsComponents/abilitiesDisplay";

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

  display: flex;
  flex-direction: column;

  align-items: center;
`

const ScrollableDetails = styled(ScrollView).attrs({
  contentContainerStyle: { alignItems: "center" }
})`
  width: 100%;
  height: 100%;

  border-radius: 20px 20px 0px 0px;

  display: flex;
  flex-direction: column;

  margin-top: 15%;
`

const PokeImageWrapper = styled.View`
  position: absolute;

  top: -50%;
  left: 5%;

  width: 90%;
  height: 70%;

  z-index: 10;
`

const hideVelocityThreshold = 2; // how "hard" it needs to be dragged down for it to be hidden

export function PokeDetails({ pokemon, setSelectedPokemon }: { pokemon: Pokemon, setSelectedPokemon: (x: Pokemon | null) => void }) {

  const animOpeningProgress = useRef(new Animated.Value(0)).current;
  const animatedTop = animOpeningProgress.interpolate({ inputRange: [0, 100], outputRange: ["130%", "35%"] });
  const animatedOpacity = animOpeningProgress.interpolate({ inputRange: [0, 100], outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,.8)'] });
  const dragStartY = useRef(0);

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
    hideLayout();
    return true;
  })

  useEffect(() => {
    Animated.timing(animOpeningProgress, {
      toValue: 100,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [animOpeningProgress]);

  const backgroundTap = Gesture.Tap().onStart(() => {
    // setSelectedPokemon(null);
    hideLayout();
  })

  const detailsFling = Gesture.Fling().direction(Directions.DOWN).onStart(() => {
    hideLayout();
  })

  const captureTapFlick = Gesture.Tap().onStart(() => { });

  return (
    <GestureDetector gesture={backgroundTap}>
      <FullWrapper style={{ backgroundColor: animatedOpacity }}>

        <GestureDetector gesture={Gesture.Race(detailsFling, captureTapFlick)}>
          <DetailsWrapper style={{ top: animatedTop, backgroundColor: types2color[pokemon.type[0]] }}>
            <PokeImageWrapper>
              <Image source={pokeImages[pokemon.id]} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
            </PokeImageWrapper>
            <ScrollableDetails
              onScrollBeginDrag={(ev) => { dragStartY.current = ev.nativeEvent.contentOffset.y; }}
              onScrollEndDrag={(ev) => {
                if (dragStartY.current <= 0 && ev.nativeEvent.velocity && ev.nativeEvent.velocity.y >= hideVelocityThreshold)
                  hideLayout(); // if started from top, and dragging to close, then close
              }}
              fadingEdgeLength={25}
              style={{ backgroundColor: types2color[pokemon.type[0]] }}>


              <DexNameAndDescription pokemon={pokemon} />
              <PokeStatsDisplay stats={pokemon.baseStats} />
              <AbilityDisplayBox abilitiesId={pokemon.abilitiesId} hiddenAbilityId={pokemon.hiddenAbility} />

            </ScrollableDetails>
          </DetailsWrapper>
        </GestureDetector>
      </FullWrapper >
    </GestureDetector>

  )
}