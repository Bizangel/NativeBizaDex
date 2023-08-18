import { styled } from "styled-components/native"
import { PokeFilter } from "../../util/filterPokemon"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { colorPalette } from "../../styles/styles"
import { produce } from "immer"


const GenFilterWrapper = styled.View`
  width: 100%;
  height: 40%;

  /* background-color: blue; */

  display: flex;
  flex-direction: row;

  flex-wrap: wrap;
  justify-content: space-evenly;
`

const GenButton = styled(TouchableWithoutFeedback) <{ isActive: boolean }>`
  width: 80px;
  height: 40px;

  background-color: ${p => p.isActive ? colorPalette.foregroundButtonBlackActive : colorPalette.foregroundButtonBlackInactive};

  display: flex;
  justify-content: center;
  align-items: center;

  margin-top: 10px;
`

const GenButtonText = styled.Text`
  color: ${colorPalette.textWhite};
`

export function GenFilterSection({ currentFilter, setCurrentFilter }: {
  currentFilter: PokeFilter,
  setCurrentFilter: React.Dispatch<React.SetStateAction<PokeFilter>>,
}) {
  return (
    <GenFilterWrapper>
      {currentFilter.genFilter.map((e, i) =>
        <GenButton style={{ borderRadius: 10 }} key={i} isActive={e}
          // rippleRadius={0}
          onPress={() => {
            setCurrentFilter(prev => produce(prev, (draft) => { draft.genFilter[i] = !draft.genFilter[i]; }));
          }}>
          <GenButtonText>Gen {i + 1}</GenButtonText>
        </GenButton>
      )}
    </GenFilterWrapper>
  )
}