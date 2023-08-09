import { memo } from "react";
import { useWindowDimensions, Image } from "react-native"
import { PokeType, Pokemon } from "../types/Pokemon";
import styled from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient';
import { types2color } from "../common/constants";
import pokeImages from "../assets/pokeImages";

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
  color: white;
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
`

const TypeDisplay = styled.Text<{ type: PokeType }>`
  width: 80px;
  height: 100%;

  text-transform: uppercase;

  background-color: ${p => types2color[p.type]};
  color: white;
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


// Pokecard dimension must always be screenWidth / 2 with same height (square!).

const PokeCard = memo(({ pokemon }: { pokemon: Pokemon }) => {
  const dimension = useWindowDimensions();

  let gradientColor = pokemon.type.map(e => types2color[e]);
  if (gradientColor.length === 1)
    gradientColor = [gradientColor[0], ...gradientColor] // repeat 1st color twice.

  return (
    <CardWrapper style={[{ width: dimension.width / 2 }]} key={pokemon.id}>

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


    </CardWrapper>
  )
})

export default PokeCard;