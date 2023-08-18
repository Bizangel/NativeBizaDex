import { styled } from "styled-components/native"
import { PokeFilter } from "../../util/filterPokemon"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"
import { colorPalette } from "../../styles/styles"
import { produce } from "immer"
import { TypeDisplay as BaseTypeDisplay } from "../../common/common"
import { PokemonTypes } from "../../common/pokeInfo"
import { ProgressiveRenderer } from "../../common/ProgressiveRenderer"


const TypeFilterWrapper = styled(ProgressiveRenderer)`
  width: 100%;

  display: flex;
  flex-direction: row;

  flex-wrap: wrap;
  justify-content: space-evenly;
` as typeof ProgressiveRenderer

const TypeButton = styled(TouchableWithoutFeedback) <{ isActive: boolean }>`
  opacity: ${p => p.isActive ? 1 : 0.3};
  /* background-color: ${p => p.isActive ? colorPalette.foregroundButtonBlackActive : colorPalette.foregroundButtonBlackInactive}; */
  margin-top: 10px;
`

const TypeDisplay = styled(BaseTypeDisplay)`
  margin: 0px;
`

export function TypesFilterSection({ currentFilter, setCurrentFilter }: {
  currentFilter: PokeFilter,
  setCurrentFilter: React.Dispatch<React.SetStateAction<PokeFilter>>,
}) {
  const activeTypes = new Set(currentFilter.typesFilter);

  return (
    <TypeFilterWrapper
      animatedOpacitySpawnDuration={300}
      initHeight={330}
      fullData={PokemonTypes}
      renderItem={(type, i) =>
        <TypeButton key={i} isActive={activeTypes.has(type)}
          onPress={() => {
            setCurrentFilter(prev => produce(prev, (draft) => {
              const foundIndex = prev.typesFilter.findIndex(ele => ele === type)
              if (foundIndex !== -1) { // toggle, exists so delete
                draft.typesFilter.splice(foundIndex, 1); // delete
              } else {
                draft.typesFilter.push(type)// add
              }
            }));
          }}>
          <TypeDisplay type={type} style={{ elevation: 15 }}>{type}</TypeDisplay>
        </TypeButton>
      }
    />
  )
}