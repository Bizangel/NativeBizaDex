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

  const activeTypes = PokemonTypes.map(e => { return { selected: currentFilter.typesFilter[e], type: e } });


  const renderItem: ProgressiveRendererRenderItem<{ type: PokeType, selected: boolean }> = useCallback(({ selected, type }) => {
    return (<TypeButton
      isActive={selected}
      onPress={() => {
        setCurrentFilter(prev => produce(prev, (draft) => { draft.typesFilter[type] = !prev.typesFilter[type] }));
      }}>
      <TypeDisplay type={type} style={{ elevation: 15 }} isActive={selected}>{type}</TypeDisplay>
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
          if (Object.values(prev.typesFilter).every(e => !e)) { // if one disabled, enable all
            return produce(prev, draft => { PokemonTypes.forEach(e => { draft.typesFilter[e] = true }) })
          } else { // disableall
            return produce(prev, draft => { PokemonTypes.forEach(e => { draft.typesFilter[e] = false }) })
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