import { Image, useWindowDimensions } from "react-native"


function PokeCard() {
  const dimension = useWindowDimensions();

  return (
    <Image source={require('../pokeimages/ho-oh.gif')} style={{ width: dimension.width / 2, aspectRatio: 1 }} />
  )
}

export default PokeCard