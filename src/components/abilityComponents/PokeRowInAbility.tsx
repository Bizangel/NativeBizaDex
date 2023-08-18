import { RectButton } from "react-native-gesture-handler"
import LinearGradient from "react-native-linear-gradient"
import { styled } from "styled-components/native"
import { Image } from "react-native"
import { getPokegradientColorFromTypes } from "../../util/utils"
import { Pokemon } from "../../types/Pokemon"
import pokeImages from "../../assets/pokeImages"
import { TypeDisplay as ExtTypeDisplay } from "../../common/common";
import { colorPalette } from "../../styles/styles"
import React from "react"
import useTypedNavigation from "../../hooks/useTypedNavigation"

const PokemonRow = styled(RectButton)`
  margin-top: 5px;
  width: 100%;
  height: 50px;
`

const PokeRowGradient = styled(LinearGradient)`
  width: 100%;
  height: 100%;

  border-radius: 10px;

  display: flex;
  flex-direction: row;
`



const PokemonImageWrapper = styled.View`
  width: 25%;
  height: 100%;
`

const DoubleRowWrapper = styled.View`
  display: flex;
  flex-direction: column;

  width: 75%;
  height: 100%;
`

const HorizontalRowcentered = styled.View`
  display: flex;
  flex-direction: row;

  align-items: center;
`

const TypeDisplay = styled(ExtTypeDisplay)`
  width: 65px;
  font-size: 10px;
`

const PokemonNameInRow = styled.Text`
  color: ${colorPalette.textWhite};

  font-size: 15px;
`

const PokeDexNumberInRow = styled.Text`
  color: ${colorPalette.textWhite};

  margin-left: 5px;
  font-size: 15px;
  opacity: .5;
`



export const PokeRowInAbility = React.memo(({ pokemon }: { pokemon: Pokemon }) => {

  const navigation = useTypedNavigation();

  return (
    <PokemonRow rippleColor="black" foreground={true} onPress={() => { navigation.navigate("MainScreen", { preSelectedPokemonId: pokemon.id }) }}>
      <PokeRowGradient colors={getPokegradientColorFromTypes(pokemon.type)} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        <PokemonImageWrapper>
          <Image source={pokeImages[pokemon.id]} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
        </PokemonImageWrapper>

        <DoubleRowWrapper>
          <HorizontalRowcentered>
            <PokemonNameInRow>{pokemon.displayName}</PokemonNameInRow>
            <PokeDexNumberInRow>#{pokemon.nationalDexNumber.toString().padStart(3, '0')}</PokeDexNumberInRow>
          </HorizontalRowcentered>
          <HorizontalRowcentered>
            {pokemon.type.map(i =>
              <TypeDisplay type={i} key={i} style={{ elevation: 15 }}>{i}</TypeDisplay>
            )}
          </HorizontalRowcentered>
        </DoubleRowWrapper>
      </PokeRowGradient>
    </PokemonRow>
  )
})