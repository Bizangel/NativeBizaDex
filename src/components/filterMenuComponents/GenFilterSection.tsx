import { styled } from "styled-components/native"
import { TouchableOpacity } from "react-native-gesture-handler"
import { colorPalette } from "../../styles/styles"
import { ProgressiveRenderer, ProgressiveRendererRenderItem } from "../../common/ProgressiveRenderer"
import { produce } from "immer"
import { useCallback } from "react"
import { PokeFilter } from "../../common/pokeInfo"

const GenFilterWrapper = styled(ProgressiveRenderer)`
  width: 100%;

  display: flex;
  flex-direction: row;

  flex-wrap: wrap;
  justify-content: space-evenly;
` as typeof ProgressiveRenderer // work around cuz idk why doesn't work

const GenButton = styled(TouchableOpacity) <{ isActive: boolean }>`
  width: 80px;
  height: 40px;

  background-color: ${p => p.isActive ? colorPalette.foregroundButtonBlackActive : colorPalette.foregroundButtonBlackInactive};

  /* opacity: ${p => p.isActive ? 1 : 0.3}; */

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

  const renderItem: ProgressiveRendererRenderItem<boolean> = useCallback((e, idx) => {
    return <GenButton style={{ borderRadius: 10 }} isActive={e} onPress={() => {
      setCurrentFilter(prev => produce(prev, (draft) => { draft.genFilter[idx] = !draft.genFilter[idx]; }));
    }}>
      <GenButtonText>Gen {idx + 1}</GenButtonText>
    </GenButton>
  }
    , [setCurrentFilter])

  return (
    <>

      <GenFilterWrapper
        initHeight={160}// initial height, before all elements are rendered, an approximation, the better the less "sloppy it will see"
        animatedOpacitySpawnDuration={300}
        fullData={currentFilter.genFilter as boolean[]}
        renderItem={renderItem}
      />

      {/* Toggle All Button */}
      <GenButton onPress={() => {
        setCurrentFilter((prev) => {
          if (prev.genFilter.some(e => e)) { // if one is enabled, disable all
            return produce(prev, draft => { draft.genFilter = draft.genFilter.map(_ => false) })
          } else { // disableall
            return produce(prev, draft => { draft.genFilter = draft.genFilter.map(_ => true) })
          }
        })
      }} style={{ borderRadius: 10 }} isActive={currentFilter.genFilter.every(e => e)}>
        <GenButtonText>
          Toggle All
        </GenButtonText>

      </GenButton>
    </>
  )
}