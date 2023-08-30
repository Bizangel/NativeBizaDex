import { styled } from "styled-components/native"
import { colorPalette } from "../../styles/styles"
import { PokeType } from "../../types/Pokemon"
import React from "react"
import { PokemonTypes, TypeChart, TypeEffectiveness } from "../../common/pokeInfo"
import { TypeDisplay } from "../../common/common"

const WeaknessDisplayWrapper = styled.View`
  background-color: ${colorPalette.backgroundBlack70};
  width: 90%;
  padding: 15px;

  margin-top: 10px;

  border-radius: 10px;
`



const WeaknessHeader = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 20px;

  width: 100%;
  text-align: center;
`



const EffectivenessWrapper = styled.View`
  margin-top: 5px;

  display: flex;
  flex-direction: row;
  align-items: center;
`

const EffectivenessNumber = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 15px;

  border-radius: 10px;

  padding: 4px;
  /* background-color: ${colorPalette.textWhite}; */
`


function TypeEffectivenessComp({ type, displayMultiplier }: { type: PokeType, displayMultiplier: string }) {
  return (
    <EffectivenessWrapper>
      <TypeDisplay type={type}>
        {type}
      </TypeDisplay>
      <EffectivenessNumber>
        {displayMultiplier}
      </EffectivenessNumber>
    </EffectivenessWrapper>
  )
}

// this should be illegal, and not very future proof? But hey javascript lets us do this
const ValueToEnum: Record<number, TypeEffectiveness> = {
  0.25: "1/4",
  0.5: "1/2",
  1: "1",
  2: "2",
  4: "4",
  0: "0",
}

function PokeWeaknessDisplay({ pokeTypes }: { pokeTypes: PokeType[], }) {

  // 0 means normal effectiveness, 1 se, 2 means x4, -1 means 1/2, -2 means 1/4
  const typeMultiplierLevel = Object.fromEntries(PokemonTypes.map(e => [e, 1])) as Record<PokeType, number>;

  pokeTypes.forEach(type => {
    const colIndex = PokemonTypes.indexOf(type);
    TypeChart.map((row, rowIdx) => {
      const ele = row[colIndex];

      const multiplier = ele === "1/2" ? 0.5 : parseFloat(ele);
      typeMultiplierLevel[PokemonTypes[rowIdx]] *= multiplier;
    })
  })


  const typeDefenses = Object.fromEntries(Object.entries(typeMultiplierLevel).map(([type, num]) => [type, ValueToEnum[num]])) as Record<PokeType, TypeEffectiveness>;

  console.log(typeDefenses)

  return (
    <WeaknessDisplayWrapper>
      <WeaknessHeader>Type Resistances</WeaknessHeader>

      <TypeEffectivenessComp type="Fire" displayMultiplier="x2" />
      <TypeEffectivenessComp type="Fire" displayMultiplier="x2" />

    </WeaknessDisplayWrapper>
  )
}

export default React.memo(PokeWeaknessDisplay) as typeof PokeWeaknessDisplay;