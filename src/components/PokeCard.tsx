import { memo } from "react";
import { StyleSheet, View, useWindowDimensions, Image } from "react-native"
import { Pokemon } from "../types/Pokemon";
import styled from 'styled-components/native'
import LinearGradient from 'react-native-linear-gradient';
import { types2color } from "../common/constants";
import pokeImages from "../assets/pokeImages";

const ActualCard = styled(LinearGradient)`
  width: 100%;
  height: 100%;
  /* background-color: linear-gradient(0deg, rgba(34,193,195,1) 0%, rgba(253,187,45,1) 100%); */
  border-radius: 5px;
  /* filter: brightness(1.5); */
  /* shadow */


`

const CardBorder = styled.View<{ borderColor: string }>`
  border-style: solid;
  border-color: red;
  border-width: 3px;
  border-radius: 5px;

  width: 100%;
  height: 100%;
`

const CardWrapper = styled.View`
  aspect-ratio: 0.8;
  padding: 10px;
`
// Pokecard dimension must always be screenWidth / 2 with same height (square!).

const PokeCard = memo(({ pokemon }: { pokemon: Pokemon }) => {
  const dimension = useWindowDimensions();

  // const x = () => {
  //   console.
  // }
  let gradientColor = pokemon.type.map(e => types2color[e]);
  if (gradientColor.length === 1)
    gradientColor = [gradientColor[0], ...gradientColor] // repeat 1st color twice.

  return (
    <CardWrapper style={[{ width: dimension.width / 2 }]} key={pokemon.id}>

      <ActualCard colors={gradientColor} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
        {/* <CardBorder borderColor={gradientColor[0]}> */}
        <Image source={pokeImages[pokemon.id]} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
        {/* </CardBorder> */}
      </ActualCard>


    </CardWrapper>
  )
})

export default PokeCard;