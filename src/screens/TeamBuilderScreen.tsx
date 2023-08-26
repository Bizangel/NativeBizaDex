import { styled } from "styled-components/native"
import { colorPalette } from "../styles/styles"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { RootStackParamList } from "../App"
import { HorizontalBottomRule } from "../common/common"
import { Image } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler"
import PokeTeamRowDisplay from "../components/TeamBuilder/PokeTeamRowDisplay"
import { useLocalStorage } from "../hooks/useLocalStorage"
import { Pokemon } from "../types/Pokemon"
import { useCallback } from "react"
import { allPokemon } from "../common/pokeInfo"



const Body = styled.View`
  width: 100%;
  height: 100%;

  background-color: ${colorPalette.backgroundBlack};

  display: flex;
  flex-direction: column;

  align-items: center;

  padding: 20px;
`


const HeaderText = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 24px;
`

const PokeRowTeamWrapper = styled.View`
  width: 100%;
  height: 100px;

  background-color: blue;
`

const AddPokeButton = styled(TouchableOpacity).attrs({
  containerStyle: { position: "absolute", bottom: "2.5%", right: "2.5%", width: 70, height: 70 }
})`
  border-radius: 35px;
  width: 100%;
  height: 100%;

  background-color: ${colorPalette.foregroundButtonBlackInactive};
  display: flex;
  justify-content: center;
  align-items: center;
`

function TeamBuilderScreen(_: NativeStackScreenProps<RootStackParamList, 'TeamBuilderScreen'>) {
  const [pokeTeams, setPokeTeams] = useLocalStorage<Pokemon[]>("poketeam", []);

  const addNewPoketoTeam = useCallback(() => {
    setPokeTeams(prev => [...prev, allPokemon[0]])
  }, [setPokeTeams]);

  return (
    <Body>
      <HeaderText>
        PokeTeams
      </HeaderText>

      <HorizontalBottomRule />

      <PokeRowTeamWrapper>
        <PokeTeamRowDisplay team={pokeTeams} />
      </PokeRowTeamWrapper>


      <AddPokeButton onPress={addNewPoketoTeam}>
        <Image source={require('../icons/cross.png')} style={{ height: "50%", width: "50%", transform: [{ rotateZ: "45deg" }] }} />
      </AddPokeButton>
    </Body>
  )
}


export default TeamBuilderScreen