import { memo } from "react";
import { Image, View, useWindowDimensions } from "react-native"
import pokeImages from "../assets/pokeImages";
import { Pokemon } from "../types/Pokemon";

const PokeCard = memo(({ pokemon }: { pokemon: Pokemon }) => {
  const dimension = useWindowDimensions();

  return (
    <View style={{ width: dimension.width / 2, aspectRatio: 1 }}>
      <Image source={pokeImages[pokemon.id]} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
    </View>
  )
})

export default PokeCard;