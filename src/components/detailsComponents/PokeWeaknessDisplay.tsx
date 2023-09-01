import { styled } from "styled-components/native"
import { colorPalette, effectiveness2color } from "../../styles/styles"
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
  background-color: ${colorPalette.superEffectiveGreen};

  width: 50px;
  text-align: center;
`

const ResistanceSideBySideWrapper = styled.View`
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`

const ColumnResistanceWrapper = styled.View`
  display: flex;
  flex-direction: column;

  /* align-items: center; */
`

const ColumnResistanceHeader = styled.Text`
  color: ${colorPalette.textWhite};

  opacity: 0.8;
  font-size: 16px;
  text-align: left;
`

function TypeEffectivenessComp({ type, displayMultiplier }: { type: PokeType, displayMultiplier: TypeEffectiveness }) {
  return (
    <EffectivenessWrapper>
      <TypeDisplay type={type}>
        {type}
      </TypeDisplay>
      <EffectivenessNumber style={{ backgroundColor: effectiveness2color[displayMultiplier] }}>
        x{displayMultiplier}
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

const findValueToEnum = (x: number) => {
  const entries = Array.from(Object.entries(ValueToEnum));
  for (const pair of entries) {
    const [possVal, effectiveness] = pair;

    if (Math.abs(parseFloat(possVal) - x) < 0.001) {
      return effectiveness as TypeEffectiveness;
    }
  }

  return undefined;
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

  const sortedEntries = Object.entries(typeMultiplierLevel);
  sortedEntries.sort((a, b) => b[1] - a[1]);

  const typeDefenses = sortedEntries.map(([type, num]) => [type, findValueToEnum(num)]) as [PokeType, TypeEffectiveness][];
  const resistantDefenses = typeDefenses.filter(e => e[1] === "1/2" || e[1] === "1/4" || e[1] === "0")
  const weakDefenses = typeDefenses.filter(e => e[1] === "2" || e[1] === "4")

  return (
    <WeaknessDisplayWrapper>
      <WeaknessHeader>Type Resistances</WeaknessHeader>

      <ResistanceSideBySideWrapper>
        <ColumnResistanceWrapper>
          <ColumnResistanceHeader>
            Resistant to
          </ColumnResistanceHeader>

          {resistantDefenses.map((e, idx) =>
            <TypeEffectivenessComp type={e[0]} displayMultiplier={e[1]} key={idx} />
          )}
        </ColumnResistanceWrapper>

        <ColumnResistanceWrapper>
          <ColumnResistanceHeader>
            Weak to
          </ColumnResistanceHeader>
          {weakDefenses.map((e, idx) =>
            <TypeEffectivenessComp type={e[0]} displayMultiplier={e[1]} key={idx} />
          )}
        </ColumnResistanceWrapper>
      </ResistanceSideBySideWrapper>
    </WeaknessDisplayWrapper>
  )
}

export default React.memo(PokeWeaknessDisplay) as typeof PokeWeaknessDisplay;