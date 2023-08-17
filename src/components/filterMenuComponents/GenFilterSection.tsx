import { styled } from "styled-components/native"
import { PokeFilter } from "../../util/filterPokemon"
import { RectButton } from "react-native-gesture-handler"
import { colorPalette } from "../../styles/styles"


const GenFilterWrapper = styled.View`
  width: 100%;
  height: 40%;

  /* background-color: blue; */
`

const GenButton = styled(RectButton)`
  width: 80px;
  height: 40px;

  background-color: ${colorPalette.foregroundButtonBlackActive};

  display: flex;
  justify-content: center;
  align-items: center;
`

const GenButtonText = styled.Text`
  color: ${colorPalette.textWhite};
`

export function GenFilterSection({ currentFilter, setCurrentFilter }: {
  currentFilter: PokeFilter,
  setCurrentFilter: (x: PokeFilter) => void,
}) {
  return (
    <GenFilterWrapper>
      {/* {currentFilter.typesFilter.map(e => e.)} */}
      <GenButton style={{ borderRadius: 10 }}>
        <GenButtonText>Gen 1</GenButtonText>
      </GenButton>

    </GenFilterWrapper>
  )
}