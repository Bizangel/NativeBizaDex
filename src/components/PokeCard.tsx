import { Image, useWindowDimensions } from "react-native"
import pokeImages from "../assets/pokeImages";


function PokeCard() {
  const dimension = useWindowDimensions();

  return (
    <Image source={pokeImages.absol} style={{ width: dimension.width / 2, aspectRatio: 1 }} />
    // <Image source={require('../pokeimages/ho-oh.gif')} style={{ width: dimension.width / 2, aspectRatio: 1 }} />
  )
}

export default PokeCard