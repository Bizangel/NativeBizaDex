import { styled } from "styled-components/native"
import { colorPalette } from "../../styles/styles"
import { Ability } from "../../types/Pokemon"
import { RectButton } from "react-native-gesture-handler"

const AbilityDisplayWrapper = styled.View`
  background-color: ${colorPalette.backgroundBlack70};
  width: 90%;
  padding: 15px;

  margin-top: 5px;

  border-radius: 10px;
`

const AbilityDisplayButton = styled(RectButton)`
  color: ${colorPalette.textWhite};
  font-size: 16px;

  min-width: 30%;

  padding: 5px 10px;

  background-color: ${colorPalette.backgroundBlack};

  display: flex;
  justify-content: center;
  align-items: center;
`

const AbilityHeader = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 20px;

  width: 100%;
  text-align: center;
`

const AbilityDisplayText = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 16px;
`

const AbilityRowWrapper = styled.View`
  margin-top: 5px;

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
`


const HiddenAbilityDisplayWrapper = styled.View`
  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: center;

  margin-top: 5px;
  opacity: 0.8;
`

const allAbilities = require('../../assets/abilities.json') as Ability[];
const abilityMap = new Map<string, Ability>();

allAbilities.forEach((abi) => {
  abilityMap.set(abi.id, abi);
})


export function AbilityDisplayBox({ abilitiesId, hiddenAbilityId }: { abilitiesId: string[], hiddenAbilityId: string | undefined }) {
  const abilities = abilitiesId.map(e => abilityMap.get(e)) as Ability[];

  const hiddenAbility = hiddenAbilityId ? abilityMap.get(hiddenAbilityId) : undefined;


  return (
    <AbilityDisplayWrapper>
      <AbilityHeader>Abilities</AbilityHeader>
      <AbilityRowWrapper>
        {abilities.map(e =>
          <AbilityDisplayButton style={{ borderRadius: 10 }} key={e.id}>
            <AbilityDisplayText>
              {e.displayName}
            </AbilityDisplayText>
          </AbilityDisplayButton>
        )}
      </AbilityRowWrapper>

      {hiddenAbility &&
        <HiddenAbilityDisplayWrapper>
          <AbilityDisplayButton style={{ borderRadius: 10 }}>
            <AbilityDisplayText>
              {hiddenAbility.displayName}
            </AbilityDisplayText>
          </AbilityDisplayButton>
        </HiddenAbilityDisplayWrapper>
      }



    </AbilityDisplayWrapper>
  )
}