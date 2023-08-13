import { styled } from "styled-components/native";
import { Pokemon } from "../types/Pokemon";
import { GestureDetector, Gesture, ScrollView } from "react-native-gesture-handler";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Image } from "react-native";
import pokeImages from "../assets/pokeImages";
import { types2color } from "../styles/styles";
import { PokeStatsDisplay } from "./detailsComponents/PokestatsDisplay";
import { DexNameAndDescription } from "./detailsComponents/DexNameAndDescription";

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

export function PokeDetails({ pokemon, setSelectedPokemon }: { pokemon: Pokemon, setSelectedPokemon: (x: Pokemon | null) => void }) {
  const animOpeningProgress = useRef(new Animated.Value(0)).current;
  const animatedTop = animOpeningProgress.interpolate({ inputRange: [0, 100], outputRange: ["130%", "35%"] });
  const animatedOpacity = animOpeningProgress.interpolate({ inputRange: [0, 100], outputRange: ['rgba(0,0,0,0)', 'rgba(0,0,0,.8)'] });

  useEffect(() => {
    Animated.timing(animOpeningProgress, {
      toValue: 100,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [animOpeningProgress]);

  const hideLayout = useCallback(() => {
    Animated.timing(animOpeningProgress, {
      toValue: 0,
      duration: 250,
      useNativeDriver: false,
    }).start(() => {
      setSelectedPokemon(null)
    });
  }, [animOpeningProgress, setSelectedPokemon])

  const backgroundTap = Gesture.Tap().onStart(() => {
    // setSelectedPokemon(null);
    hideLayout();
  })

  const detailsTap = Gesture.Tap().onStart(() => { })

  return (
    <GestureDetector gesture={backgroundTap}>
      <FullWrapper style={{ backgroundColor: animatedOpacity }}>

        <GestureDetector gesture={detailsTap}>
          <DetailsWrapper style={{ top: animatedTop, backgroundColor: types2color[pokemon.type[0]] }}>
            <PokeImageWrapper>
              <Image source={pokeImages[pokemon.id]} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
            </PokeImageWrapper>
            <ScrollableDetails style={{ backgroundColor: types2color[pokemon.type[0]] }}>

              <DexNameAndDescription pokemon={pokemon} />
              <PokeStatsDisplay stats={pokemon.baseStats} />

            </ScrollableDetails>
          </DetailsWrapper>
        </GestureDetector>
      </FullWrapper >
    </GestureDetector>

  )
}