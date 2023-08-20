import { styled } from "styled-components/native"
import { colorPalette } from "../../styles/styles"
import { Pokemon } from "../../types/Pokemon"
import { Image, View } from "react-native"
import pokeImages from "../../assets/pokeImages"
import { TouchableOpacity } from "react-native-gesture-handler"
import { pokeMapping } from "../../common/pokeInfo"
import { ValueOf, findEvotreeStartingNodes } from "../../util/utils"

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
  flex-direction: column;
  align-items: center;

  flex-wrap: wrap;
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

const evoLengthToArrowIndices = [[], [0], [-1, 1], [-1, 0, 1]] as const;

function EvoRecDisplay({ targetPokeID, fullEvoTreeRef }: { targetPokeID: string, fullEvoTreeRef: Pokemon["evoTree"] }) {

  const differentEvos = fullEvoTreeRef[targetPokeID]
  if (differentEvos === undefined) // that one doesn't evolve, return last
    return <EvoPokeSquareDisplay pokeId={targetPokeID} />

  const SplittedTrees: (ValueOf<Pokemon["evoTree"]>)[] = [[]];

  differentEvos.forEach((ele) => {
    if (SplittedTrees.at(-1)?.length === 3)
      SplittedTrees.push([ele])// add to new
    else
      SplittedTrees.at(-1)?.push(ele)
  })

  // it has evolution, render all evolutions
  return (
    <View style={{ display: "flex", flexDirection: "column" }}>
      {SplittedTrees.map(split => {

        const arrowIndices = evoLengthToArrowIndices[split.length];

        return (
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <EvoPokeSquareDisplay pokeId={targetPokeID} />
            <EvoSplitColumn>
              {split.map((e, i) =>
                <View style={{ display: "flex", flexDirection: "row", alignItems: displayAlignmentMapping[arrowIndices[i]] }} key={i}>
                  <EvoArrowComponent evoReason={e.evolveReason} displayIndex={arrowIndices[i]} />
                  <EvoRecDisplay targetPokeID={e.pokeId} fullEvoTreeRef={fullEvoTreeRef} />
                </View>
              )}
            </EvoSplitColumn>
          </View>
        )
      })}
    </View>
  )
}

export function EvoTreeDisplay({ pokemon }: { pokemon: Pokemon }) {

  // have to find starting nodes as there may be multiple
  console.log(findEvotreeStartingNodes(pokemon.evoTree))

  return (
    <FullEvotreeCenteredWrapper>
      <EvotreeDisplayWrapper>
        <>
          {findEvotreeStartingNodes(pokemon.evoTree).map(e =>
            <EvoRecDisplay targetPokeID={e} fullEvoTreeRef={pokemon.evoTree} key={e} />
          )}
        </>
      </EvotreeDisplayWrapper>
    </FullEvotreeCenteredWrapper>
  )
}