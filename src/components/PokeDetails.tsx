import { styled } from "styled-components/native";
import { Pokemon } from "../types/Pokemon";
import { TouchableOpacity, TouchableWithoutFeedback, TapGesture, GestureDetector, Gesture } from "react-native-gesture-handler";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Image } from "react-native";
import { types2color } from "../common/constants";
import pokeImages from "../assets/pokeImages";

const FullWrapper = styled(Animated.View)`
  position: absolute;
  top: 0%;
  left: 0;

  width: 100%;
  height: 100%;

  background-color: rgba(0,0,0,.7);
`

const DetailsWrapper = styled(Animated.View)`
  position: relative;
  top: 35%;
  width: 100%;
  height: 65%;
  background-color: blue;

  transition: height;

  border-radius: 20px 20px 0px 0px;
`

const PokeImageWrapper = styled.View`
  position: absolute;

  top: -50%;
  left: 5%;

  width: 90%;
  height: 70%;
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

          </DetailsWrapper>
        </GestureDetector>
      </FullWrapper >
    </GestureDetector>

  )
}