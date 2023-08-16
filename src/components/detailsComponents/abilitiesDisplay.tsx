import { styled } from "styled-components/native"
import { colorPalette } from "../../styles/styles"
import { Ability } from "../../types/Pokemon"
import { RectButton } from "react-native-gesture-handler"
import { abilityMap } from "../../common/pokeInfo"
import useTypedNavigation from "../../hooks/useTypedNavigation"

const AbilityDisplayWrapper = styled.View`
  background-color: ${colorPalette.backgroundBlack70};
  width: 90%;
  padding: 15px;

  margin-top: 10px;

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



export function AbilityDisplayBox({ abilitiesId, hiddenAbilityId }: {
  abilitiesId: string[], hiddenAbilityId: string | undefined,
}) {
  const abilities = abilitiesId.map(e => abilityMap.get(e)) as Ability[];

  const hiddenAbility = hiddenAbilityId ? abilityMap.get(hiddenAbilityId) : undefined;
  const navigation = useTypedNavigation();

  return (
    <AbilityDisplayWrapper>
      <AbilityHeader>Abilities</AbilityHeader>
      <AbilityRowWrapper>
        {abilities.map(e =>
          <AbilityDisplayButton style={{ borderRadius: 10 }} key={e.id}
            onPress={() => {
              navigation.push("AbilityScreen", { abilityId: e.id })
            }}
          >
            <AbilityDisplayText>
              {e.displayName}
            </AbilityDisplayText>
          </AbilityDisplayButton>
        )}
      </AbilityRowWrapper>

      {hiddenAbility &&
        <HiddenAbilityDisplayWrapper>
          <AbilityDisplayButton style={{ borderRadius: 10 }} onPress={() => { navigation.push("AbilityScreen", { abilityId: hiddenAbility.id }) }}>
            <AbilityDisplayText>
              {hiddenAbility.displayName}
            </AbilityDisplayText>
          </AbilityDisplayButton>
        </HiddenAbilityDisplayWrapper>
      }



    </AbilityDisplayWrapper>
  )
}