import { styled } from "styled-components/native";
import { RootStackParamList } from "../App";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colorPalette } from "../styles/styles";
import { abilityMap, allPokemon } from "../common/pokeInfo";
import { StyleSheet } from "react-native"
import { ScrollView } from "react-native-gesture-handler";
import { useEffect, useState } from "react"
import { PokeRowInAbility } from "../components/abilityComponents/PokeRowInAbility";

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
  const [renderPoke, setRenderPoke] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setRenderPoke(true);
    }, 150);

    return () => {
      clearTimeout(timeout);
    }
  }, [])

  const abilityId = route.params.abilityId;
  const ability = abilityMap.get(abilityId);

  if (!ability)
    throw new Error(`Unable to find ability with id: ${abilityId}`)

  const pokemonThatHaveTheAbility = allPokemon.filter(e => e.abilitiesId.some(abi => abi === abilityId));

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
          {renderPoke && pokemonThatHaveTheAbility.map(e =>
            <PokeRowInAbility pokemon={e} key={e.id} />
          )}
        </PokemonThatHaveTheAbilityScrollableDisplay>

      </ScrollableWrapper>

    </Body>
  )
}

export default AbilityScreen;