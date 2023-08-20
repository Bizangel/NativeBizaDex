import { styled } from "styled-components/native"
import { colorPalette } from "../../styles/styles"
import { Pokemon } from "../../types/Pokemon"
import { Image, View } from "react-native"
import pokeImages from "../../assets/pokeImages"
import { TouchableOpacity } from "react-native-gesture-handler"
import { pokeMapping } from "../../common/pokeInfo"

const FullEvotreeCenteredWrapper = styled.View`
  width: 90%;

  display: flex;
  flex-direction: row;

  justify-content: center;
  align-items: center;

  margin-top: 10px;
  padding: 10px;

  background-color: ${colorPalette.backgroundBlack70};
  border-radius: 10px;
`


const EvotreeDisplayWrapper = styled.View`
  display: flex;
  flex-direction: row;
  align-items: center;
  /* justify-content: center; */
`


const EvoTransitionWrapper = styled.View`
  /* background-color: blue; */
`

const EvoTransitionTextDisplay = styled.Text`
  width: 50px;

  font-size: 9px;
  color: ${colorPalette.textWhite};

  text-align: center;
`

const EvoArrowWrapper = styled.View`
  width: 50px;
  height: 30px;
`

const EvoSplitColumn = styled.View`
  display: flex;
  flex-direction: column;
`
const displayAlignmentRotationMapping = {
  [-1]: "-45deg",
  [0]: "0deg",
  [1]: "45deg"
}

function EvoArrowComponent({ evoReason, displayIndex }: { evoReason: string, displayIndex: -1 | 0 | 1 }) {
  return (
    <EvoTransitionWrapper style={{ flexDirection: displayIndex === -1 ? "column-reverse" : undefined }}>
      <EvoArrowWrapper>
        <Image source={require('../../icons/leftarrow_slim.png')} resizeMode="contain"
          style={{ flex: 1, width: undefined, height: undefined, transform: [{ rotate: displayAlignmentRotationMapping[displayIndex] }] }} />
      </EvoArrowWrapper>
      <EvoTransitionTextDisplay>
        {evoReason}
      </EvoTransitionTextDisplay>
    </EvoTransitionWrapper>
  )
}

const displayAlignmentMapping = {
  [-1]: "flex-end",
  [0]: "center",
  [1]: "flex-start"
} as const

function EvoTargetComponent({ evoReason, pokeTargetId, displayIndex }: { evoReason: string, pokeTargetId: string, displayIndex: -1 | 0 | 1 }) {

  return (
    <View style={{ display: "flex", flexDirection: "row", alignItems: displayAlignmentMapping[displayIndex] }}>
      <EvoArrowComponent evoReason={evoReason} displayIndex={displayIndex} />
      <EvoPokeSquareDisplay pokeId={pokeTargetId} />
    </View>
  )
}


const EvoSquareWrapper = styled.View`
  margin-top: 10px;
  padding: 2px;
  display: flex;
  flex-direction: column;

  align-items: center;

  background-color: ${colorPalette.backgroundBlack};
  border-radius: 15px;
`

const EvoSquarePokeImageWrapper = styled.View`
  width: 80px;
  height: 80px;
`

const EvoSquarePokenameDisplay = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 12px;

  text-align: center;
`

function EvoPokeSquareDisplay({ pokeId }: { pokeId: string }) {
  const pokeName = pokeMapping.get(pokeId)?.displayName

  return (
    <TouchableOpacity>
      <EvoSquareWrapper>
        <EvoSquarePokeImageWrapper>
          <Image source={pokeImages[pokeId]} resizeMode="contain" style={{ flex: 1, width: undefined, height: undefined }} />
          <EvoSquarePokenameDisplay>
            {pokeName}
          </EvoSquarePokenameDisplay>
        </EvoSquarePokeImageWrapper>
      </EvoSquareWrapper>
    </TouchableOpacity>
  )
}


// function EvoRecDisplay({ targetPokeID }: { targetPokeID: string }) {
//   return (

//   )
// }

export function EvoTreeDisplay({ pokemon }: { pokemon: Pokemon }) {


  return (
    <FullEvotreeCenteredWrapper>
      <EvotreeDisplayWrapper>

        <EvoPokeSquareDisplay pokeId="ralts" />
        <EvoTargetComponent evoReason="Lvl 20" pokeTargetId="kirlia" displayIndex={0} />
        {/* <EvoArrowComponent evoReason="(Evolve at lvl 34)" /> */}


        <EvoSplitColumn>
          <EvoTargetComponent evoReason="(Level 30)" pokeTargetId="gardevoir" displayIndex={-1} />
          <EvoTargetComponent evoReason="(use Dawn Stone, Male)" pokeTargetId="gallade" displayIndex={1} />
          {/* <EvoArrowComponent evoReason="Evolve at lvl 34" />
        <EvoArrowComponent evoReason="Evolve at lvl 34" /> */}
        </EvoSplitColumn>

      </EvotreeDisplayWrapper>
    </FullEvotreeCenteredWrapper>
  )
}