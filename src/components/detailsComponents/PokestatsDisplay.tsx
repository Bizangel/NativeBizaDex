import { DimensionValue } from "react-native";
import { styled } from "styled-components/native"
import { clamp, getStatColorBasedOnAmount } from "../util/utils";
import { BaseStatName, Pokemon } from "../../types/Pokemon";
import { colorPalette } from "../../styles/styles";

const PokeStatsDisplayWrapper = styled.View`
  width: 90%;

  display: flex;
  flex-direction: column;

  justify-content: space-evenly;
  align-items: center;

  margin-top: 10px;
  padding: 10px;

  background-color: ${colorPalette.backgroundBlack70};
  border-radius: 10px;
`

const PokeStatRow = styled.View`
  display: flex;
  width: 100%;
  height: 20px;

  display: flex;
  flex-direction: row;

  align-items: center;

  /* background-color: yellow; */
`

const PokeStatNameDisplay = styled.Text`
  width: 100px;
  font-size: 16px;
  color: ${colorPalette.textWhite};

  text-align: right;
  padding-right: 5px;

  /* background-color: skyblue; */
`

const PokeStatValueDisplay = styled.Text`
  width: 40px;
  font-size: 16px;
  color: ${colorPalette.textWhite};
  text-align: right;

  /* background-color: gray; */
`

const PokeStatsBarWrapper = styled.View`
  display: flex;
  flex-direction: row;
  flex: 1;

  align-items: center;
  justify-content: start;

  padding-left: 5px;
  height: 100%;

  /* background-color: brown; */
`


const PokeStatsBar = styled.View`
  height: 40%;
  border-radius: 20px;
`

const statDisplayName: Record<BaseStatName, string> = {
  hp: "Health",
  atk: "Attack",
  def: "Defense",
  spa: "Sp. Attack",
  spd: "Sp. Defense",
  spe: "Speed",
}
// we consider 200 to be max stat for practical bar purposes.
const getStatWidth = (statVal: number): DimensionValue => `${clamp(statVal / 2, 0, 100)}%`

export function PokeStatsDisplay({ stats }: { stats: Pokemon["baseStats"] }) {
  return (
    <PokeStatsDisplayWrapper>
      {stats.map(({ statName, statValue }) =>
        <PokeStatRow>
          <PokeStatNameDisplay>{statDisplayName[statName]}</PokeStatNameDisplay>
          <PokeStatValueDisplay>{statValue}</PokeStatValueDisplay>
          <PokeStatsBarWrapper>
            <PokeStatsBar style={
              {
                backgroundColor: getStatColorBasedOnAmount(statValue),
                width: getStatWidth(statValue)
              }
            } />
          </PokeStatsBarWrapper>
        </PokeStatRow>
      )}
    </PokeStatsDisplayWrapper>
  )
}