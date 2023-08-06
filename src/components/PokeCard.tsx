import { memo } from "react";
import { Image, View, useWindowDimensions } from "react-native"
import pokeImages from "../assets/pokeImages";
import { Pokemon } from "../types/Pokemon";

// Pokecard dimension must always be screenWidth / 2 with same height (square!).

const PokeCard = memo(({ pokemon }: { pokemon: Pokemon }) => {
  const dimension = useWindowDimensions();

  return (
    <View style={{ width: dimension.width / 2, aspectRatio: 1 }} key={pokemon.id}>
      <Image source={pokeImages[pokemon.id]} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
    </View>
  )
})

export default PokeCard;