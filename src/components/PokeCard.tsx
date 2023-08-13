import { memo } from "react";
import { useWindowDimensions, Image } from "react-native"
import { PokeType, Pokemon } from "../types/Pokemon";
import styled from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient';
import pokeImages from "../assets/pokeImages";
import { RectButton } from 'react-native-gesture-handler';
import { colorPalette, types2color, types2semiEndColor } from "../styles/styles";

const ActualCard = styled(LinearGradient)`
  width: 100%;
  height: 100%;

  border-radius: 5px;

  padding-top: 5px;
`

const CardWrapper = styled.View`
  aspect-ratio: 0.8;
  padding: 10px;
`

const DexNumber = styled.Text`
  position: absolute;
  top: 0;
  left: 0;

  font-size: 16px;
  color: ${colorPalette.textWhite};
  margin-left: 5px;

  font-family: Arial;

  z-index: 3;
  opacity: .7;
`

const TypeDisplayWrapper = styled.View`
  /* background-color: blue; */

  width: 100%;
  height: 30px;

  display: flex;
  justify-content: space-around;

  flex-direction: row;
  padding-bottom: 5px;
  margin-bottom: 5px;
`

const TypeDisplay = styled.Text<{ type: PokeType }>`
  width: 80px;
  height: 100%;

  text-transform: uppercase;

  background-color: ${p => types2color[p.type]};
  color: ${colorPalette.textWhite};
  text-shadow: 1px 1px 2px rgba(0,0,0,.7);
  text-align: center;

  border-radius: 4px;

  padding: 0px 4px;
`

const PokenameDisplay = styled.Text`
  text-align: center;

  font-size: 20px;
  padding: 5px 5%;
  color: white;

  text-shadow: 1px 1px 2px rgba(0,0,0,.7);
`

// const PressableExample = styled.Pressable`
// `


// Pokecard dimension must always be screenWidth / 2 with same height (square!).

const PokeCard = memo(({ pokemon, setSelectedPokemon }: { pokemon: Pokemon, setSelectedPokemon: (x: Pokemon | null) => void }) => {
  const dimension = useWindowDimensions();

  let gradientColor = pokemon.type.map(e => types2color[e]);

  if (gradientColor.length === 1) {
    gradientColor = [gradientColor[0], types2semiEndColor[pokemon.type[0]]] // repeat 1st color twice.
  }

  return (
    <CardWrapper style={[{ width: dimension.width / 2 }]} key={pokemon.id}>

      <RectButton
        onPress={() => { setSelectedPokemon(pokemon) }}
        underlayColor="black" foreground={true} style={{ backgroundColor: "black" }} rippleColor="black">
        <ActualCard colors={gradientColor} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
          <DexNumber>#{pokemon.nationalDexNumber}</DexNumber>

          <Image source={pokeImages[pokemon.id]} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
          <PokenameDisplay>{pokemon.displayName}</PokenameDisplay>
          <TypeDisplayWrapper>
            {pokemon.type.map(e =>
              <TypeDisplay type={e} key={e} style={{ elevation: 10 }}>{e}</TypeDisplay>
            )}
          </TypeDisplayWrapper>

        </ActualCard>
      </RectButton>


    </CardWrapper>
  )
})

export default PokeCard;