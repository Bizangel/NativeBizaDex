import { styled } from "styled-components/native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { colorPalette, types2color } from "../../styles/styles"
import { produce } from "immer"
import { TypeDisplay as BaseTypeDisplay } from "../../common/common"
import { PokemonTypes } from "../../common/pokeInfo"
import { ProgressiveRenderer, ProgressiveRendererRenderItem } from "../../common/ProgressiveRenderer"
import { PokeType } from "../../types/Pokemon"
import { AddOpacityToColorString } from "../../util/utils"
import { useCallback } from "react"
import { PokeFilter } from "../../common/pokeInfo"

const TypeFilterWrapper = styled(ProgressiveRenderer)`
  width: 100%;

  display: flex;
  flex-direction: row;

  flex-wrap: wrap;
  justify-content: space-evenly;
` as typeof ProgressiveRenderer

const TypeButton = styled(TouchableOpacity) <{ isActive: boolean }>`
  /* opacity: ${p => p.isActive ? 1 : 0.3}; */
  /* background-color: ${p => p.isActive ? colorPalette.foregroundButtonBlackActive : colorPalette.foregroundButtonBlackInactive}; */
  margin-top: 10px;
`

const TypeDisplay = styled(BaseTypeDisplay) <{ type: PokeType, isActive: boolean }>`
  margin: 0px;

  background-color: ${p => p.isActive ? types2color[p.type] : AddOpacityToColorString(types2color[p.type], 0.5)};
  opacity: ${p => p.isActive ? 1 : 0.5};
`

export function TypesFilterSection({ currentFilter, setCurrentFilter }: {
  currentFilter: PokeFilter,
  setCurrentFilter: React.Dispatch<React.SetStateAction<PokeFilter>>,
}) {
  const activeTypesSet = new Set(currentFilter.typesFilter);

  const activeTypes = PokemonTypes.map(e => activeTypesSet.has(e));

  const renderItem: ProgressiveRendererRenderItem<boolean> = useCallback((isActive, idx) => {
    return (<TypeButton isActive={isActive}
      onPress={() => {
        setCurrentFilter(prev => produce(prev, (draft) => {
          const foundIndex = prev.typesFilter.findIndex(ele => ele === PokemonTypes[idx])
          if (foundIndex !== -1) { // toggle, exists so delete
            draft.typesFilter.splice(foundIndex, 1); // delete
          } else {
            draft.typesFilter.push(PokemonTypes[idx])// add
          }
        }));
      }}>
      <TypeDisplay type={PokemonTypes[idx]} style={{ elevation: 15 }} isActive={isActive}>{PokemonTypes[idx]}</TypeDisplay>
    </TypeButton>)
  }, [setCurrentFilter])

  return (
    <>
      <TypeFilterWrapper
        animatedOpacitySpawnDuration={300}
        initHeight={220}
        fullData={activeTypes}
        renderItem={renderItem}
      />

      <TypeButton onPress={() => {
        setCurrentFilter((prev) => {
          if (prev.typesFilter.length === 0) { // if one disabled, enable all
            return produce(prev, draft => { draft.typesFilter = [...PokemonTypes] })
          } else { // disableall
            return produce(prev, draft => { draft.typesFilter = [] })
          }
        })
      }} style={{ borderRadius: 10 }} isActive={true}>
        <TypeDisplay type="Fire" style={{ backgroundColor: colorPalette.backgroundBlack }} isActive>
          Toggle All
        </TypeDisplay>
      </TypeButton >
    </>

  )
}