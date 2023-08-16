import { styled } from "styled-components/native";
import { RootStackParamList } from "../App";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colorPalette } from "../styles/styles";
import { abilityMap, allPokemon } from "../common/pokeInfo";
import { StyleSheet } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState, useMemo, useCallback } from "react"
import { PokeRowInAbility } from "../components/abilityComponents/PokeRowInAbility";
import { Pokemon } from "../types/Pokemon";

const Body = styled.View`
  width: 100%;
  height: 100%;

  background-color: ${colorPalette.backgroundBlack};

  display: flex;
  flex-direction: column;

  align-items: center;
`


export const AbilityHeader = styled.Text`
  color: ${colorPalette.textWhite};

  text-align: center;

  font-size: 40px;
  margin-top: 20px;
`

export const AbilityInGameDescription = styled.Text`
  color: ${colorPalette.textWhite};
  width: 80%;
  text-align: justify;

  font-size: 15px;
`

export const HorizontalBottomRule = styled.View`
  width: 85%;
  border-color: ${colorPalette.textWhite};

  margin: 5px 0px;
  border-bottom-width: ${StyleSheet.hairlineWidth}px;
`

export const EffectLiteralHeader = styled.Text`
  margin-top: 10px;
  font-size: 24px;
  color: ${colorPalette.textWhite};
`


export const AbilityEffectDescription = styled.Text`
  color: ${colorPalette.textWhite};
  width: 80%;
  text-align: justify;

  font-size: 15px;
`

export const PokemonHeader = styled.Text`
  margin-top: 10px;

  color: ${colorPalette.textWhite};

  font-size: 20px;
`

const ScrollableWrapper = styled.View`
  width: 80%;
  height: 50%;

  flex: 1;

  margin-bottom: 25px;
`

const PokemonThatHaveTheAbilityScrollableDisplay = styled(ScrollView).attrs({
  contentContainerStyle: { width: "100%" },
  fadingEdgeLength: 25,
})`
  height: 100%;
  width: 100%;
`

function AbilityScreen({ route }: NativeStackScreenProps<RootStackParamList, 'AbilityScreen'>) {
  const [renderedPokes, setRenderedPokes] = useState<Pokemon[]>([]);

  const abilityId = route.params.abilityId;
  const pokemonThatHaveTheAbility = useMemo(() => allPokemon.filter(e => e.abilitiesId.some(abi => abi === abilityId) || e.hiddenAbility === abilityId), [abilityId]);

  useEffect(() => {
    // render first pokes initially, and then trigger chain.
    if (pokemonThatHaveTheAbility) {
      setRenderedPokes([pokemonThatHaveTheAbility[0]]);
    }
  }, [pokemonThatHaveTheAbility])

  const addTolist = useCallback((idx: number) => {
    setRenderedPokes(prev => {
      if (idx < prev.length) { // as failsafe if re-renders happen for some reason. only add non added idx.
        return prev;
      }

      if (idx >= pokemonThatHaveTheAbility.length) // finished adding
        return prev;

      return [...prev, pokemonThatHaveTheAbility[idx]];
    })
  }, [setRenderedPokes, pokemonThatHaveTheAbility])

  const ability = abilityMap.get(abilityId);
  if (!ability)
    throw new Error(`Unable to find ability with id: ${abilityId}`)

  return (
    <Body>
      <AbilityHeader>
        {ability.displayName}
      </AbilityHeader>

      <HorizontalBottomRule />

      <AbilityInGameDescription>
        {ability.gameDescription}
      </AbilityInGameDescription>

      <EffectLiteralHeader>
        Effect
      </EffectLiteralHeader>

      <HorizontalBottomRule />

      <AbilityEffectDescription>
        {ability.effect}
      </AbilityEffectDescription>

      <PokemonHeader>
        Pokemon that have {ability.displayName}
      </PokemonHeader>

      <HorizontalBottomRule />

      <ScrollableWrapper>
        <PokemonThatHaveTheAbilityScrollableDisplay>
          {renderedPokes.map((e, idx) =>
            <PokeRowInAbility pokemon={e} key={idx} addToList={addTolist} toAddIndex={idx + 1} />
          )}
        </PokemonThatHaveTheAbilityScrollableDisplay>

      </ScrollableWrapper>

    </Body>
  )
}

export default AbilityScreen;