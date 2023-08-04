import { Image, View, useWindowDimensions } from "react-native"
import pokeImages from "../assets/pokeImages";
import { Pokemon } from "../types/Pokemon";

function PokeCard({ pokemon }: { pokemon: Pokemon }) {
  const dimension = useWindowDimensions();

  return (
    <View style={{ width: dimension.width / 2, aspectRatio: 1 }}>
      <Image source={pokeImages[pokemon.id]} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
    </View>
    // <Image source={require('../pokeimages/ho-oh.gif')} style={{ width: dimension.width / 2, aspectRatio: 1 }} />
  )
}

export default PokeCard