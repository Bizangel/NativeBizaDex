import { styled } from "styled-components/native"
import { colorPalette } from "../../styles/styles"
import { Pokemon } from "../../types/Pokemon"
import { Image, View } from "react-native"
import pokeImages from "../../assets/pokeImages"
import { TouchableOpacity } from "react-native-gesture-handler"
import { pokeMapping } from "../../common/pokeInfo"
import { findEvotreeStartingNodes, splitIntoThrees } from "../../util/utils"
import React, { useCallback } from "react"

const FullEvotreeCenteredWrapper = styled.View`
  width: 90%;

  display: flex;
  flex-direction: column;

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
`


const EvoTransitionWrapper = styled.View`

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

function EvoPokeSquareDisplay({ pokeId, switchPokeRef }: { pokeId: string, switchPokeRef: (x: Pokemon) => void }) {
  const poke = pokeMapping.get(pokeId)
  const pokeName = poke?.displayName;

  return (
    <TouchableOpacity onPress={() => { if (poke) switchPokeRef(poke); }}>
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

function EvoRecDisplay({ targetPokeID, fullEvoTreeRef, switchPokeRef }: { targetPokeID: string, fullEvoTreeRef: Pokemon["evoTree"], switchPokeRef: (x: Pokemon) => void }) {
  const differentEvos = fullEvoTreeRef[targetPokeID]
  if (differentEvos === undefined) // that one doesn't evolve, return last
    return (<EvoPokeSquareDisplay pokeId={targetPokeID} switchPokeRef={switchPokeRef} />)

  const SplittedTrees = splitIntoThrees(differentEvos);

  // it has evolution, render all evolutions
  return (
    <View style={{ display: "flex", flexDirection: "column" }}>
      {SplittedTrees.map((split, splitTreeIdx) => {

        const arrowIndices = evoLengthToArrowIndices[split.length];

        return (
          <View style={{ display: "flex", flexDirection: "row", alignItems: "center" }} key={splitTreeIdx}>
            <EvoPokeSquareDisplay pokeId={targetPokeID} switchPokeRef={switchPokeRef} />
            <EvoSplitColumn>
              {split.map((e, i) =>
                <View style={{ display: "flex", flexDirection: "row", alignItems: displayAlignmentMapping[arrowIndices[i]] }} key={i}>
                  <EvoArrowComponent evoReason={e.evolveReason} displayIndex={arrowIndices[i]} />
                  <EvoRecDisplay targetPokeID={e.pokeId} fullEvoTreeRef={fullEvoTreeRef} switchPokeRef={switchPokeRef} />
                </View>
              )}
            </EvoSplitColumn>
          </View>
        )
      })}
    </View>
  )
}

const EvoTreeHeader = styled.Text`
  font-size: 20px;
  color: ${colorPalette.textWhite};
`

const EvoTreeDoesNotEvolveText = styled.Text`
  font-size: 14px;
  color: ${colorPalette.textWhite};
`

function EvoTreeDisplayNonMemod({ pokemon, onPokecardPress }: { pokemon: Pokemon, onPokecardPress: (x: Pokemon) => void }) {

  const switchPokeRef = useCallback((x: Pokemon) => { // hook into it to avoid switching if same poke.
    if (pokemon.id !== x.id)
      onPokecardPress(x)
  }, [onPokecardPress, pokemon])

  if (Object.keys(pokemon.evoTree).length === 0)
    return (
      <FullEvotreeCenteredWrapper>
        <EvoTreeHeader> Evolution Tree</EvoTreeHeader>
        <EvoTreeDoesNotEvolveText> This pokemon does not evolve. </EvoTreeDoesNotEvolveText>
      </FullEvotreeCenteredWrapper>
    )

  return (
    <FullEvotreeCenteredWrapper>
      <EvoTreeHeader>
        Evolution Tree
      </EvoTreeHeader>
      <EvotreeDisplayWrapper>
        <>
          {findEvotreeStartingNodes(pokemon.evoTree).map(e =>
            <EvoRecDisplay targetPokeID={e} fullEvoTreeRef={pokemon.evoTree} key={e} switchPokeRef={switchPokeRef} />
          )}
        </>
      </EvotreeDisplayWrapper>
    </FullEvotreeCenteredWrapper>
  )
}

// memod as it is quite fat.
export const EvoTreeDisplay = React.memo(EvoTreeDisplayNonMemod) as typeof EvoTreeDisplayNonMemod;
