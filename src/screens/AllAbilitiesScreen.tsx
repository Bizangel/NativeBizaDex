import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { styled } from "styled-components/native";
import { RootStackParamList } from "../App";
import { TouchableOpacity } from "react-native-gesture-handler";
import { colorPalette } from "../styles/styles";
import { Ability } from "../types/Pokemon";
import { allAbilities } from "../common/pokeInfo";
import { useCallback, useState, useRef, useEffect } from "react"
import useTypedNavigation from "../hooks/useTypedNavigation";
import { OpacitySpawn, TextInputWithBlurOnHide } from "../common/common";
import { lowercaseAZNormalizeMobile } from "../util/utils";
import { FlashList, ListRenderItem } from "@shopify/flash-list";
import { Image } from "react-native";



const AbilityRowWrapper = styled(TouchableOpacity)`
  width: 100%;

  background-color: ${colorPalette.foregroundButtonBlackInactive};
  margin-bottom: 20px;
  padding: 5px 20px;
  border-radius: 5px;

  display: flex;
  align-items: center;
`

const AbilityRowHeaderName = styled.Text`
  text-align: center;
  font-size: 24px;
  color: ${colorPalette.textWhite};
`

const AbilityDescription = styled.Text`
  text-align: justify;
  font-size: 14px;
  color: ${colorPalette.textWhite};
`

function AbilityRow({ ability }: { ability: Ability }) {
  const navigation = useTypedNavigation()
  return (
    <AbilityRowWrapper onPress={() => { navigation.push("AbilityScreen", { abilityId: ability.id }) }}>
      <AbilityRowHeaderName>
        {ability.displayName}
      </AbilityRowHeaderName>
      <AbilityDescription>
        {ability.gameDescription}
      </AbilityDescription>
    </AbilityRowWrapper>
  )
}



const AllAbilitiesWrapper = styled.View`
  width: 100%;
  height: 100%;

  background-color: ${colorPalette.backgroundBlack};
  padding: 20px;
`

const TopBarSearchWrapper = styled.View`
  width: 80%;
  height: 40px;

  /* background-color: blue; */
`

const TopbarSearchInput = styled(TextInputWithBlurOnHide)`
  font-size: 16px;
`

const EmptyDisplay = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 24px;

  width: 100%;
  top: 20%;

  left: 20px;

  position: absolute;
  text-align: center;
`


const CloseButtonWrapper = styled(TouchableOpacity).attrs({
  containerStyle: { width: 30, height: 30, position: "absolute", top: 0, right: 0, margin: 10 }
})`
  width: 100%;
  height: 100%;

  z-index: 1;
`

function AllAbilitiesScreen(_: NativeStackScreenProps<RootStackParamList, 'AllAbilitiesScreen'>) {

  const [currentAbilitySearch, setCurrentAbilitySearch] = useState("");
  const flashListRef = useRef<FlashList<Ability>>(null);
  const navigate = useTypedNavigation();

  useEffect(() => {
    flashListRef.current?.scrollToIndex({ animated: true, index: 0 })
  }, [currentAbilitySearch])

  const renderItem: ListRenderItem<Ability> = useCallback(({ item }) => {
    return (
      <OpacitySpawn spawnDuration={300}>
        <AbilityRow ability={item} />
      </OpacitySpawn>

    )
  }, [])

  const closeAbilityScreen = useCallback(() => {
    navigate.pop();
  }, [navigate])

  let toRenderAbilities = allAbilities;
  if (currentAbilitySearch.length > 0)
    toRenderAbilities = toRenderAbilities.filter(e => lowercaseAZNormalizeMobile(e.displayName).includes(lowercaseAZNormalizeMobile(currentAbilitySearch)));

  return (
    <AllAbilitiesWrapper>
      <CloseButtonWrapper onPress={closeAbilityScreen}>
        <Image source={require('../icons/cross.png')} resizeMode="contain" style={{ width: "100%", height: "100%" }} />
      </CloseButtonWrapper>

      <TopBarSearchWrapper>
        <TopbarSearchInput
          value={currentAbilitySearch}
          onChangeText={(e: string) => {
            setCurrentAbilitySearch(e)
          }}
          placeholder="Search Ability by Name"
        />

      </TopBarSearchWrapper>
      <FlashList
        ref={flashListRef}
        data={toRenderAbilities}
        estimatedItemSize={100}
        renderItem={renderItem}
      />

      {toRenderAbilities.length === 0 &&
        <EmptyDisplay>
          No matching abilities found
        </EmptyDisplay>
      }

    </AllAbilitiesWrapper>
  )
}

export default AllAbilitiesScreen;
