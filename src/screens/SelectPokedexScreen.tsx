import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { HorizontalBottomRule } from "../common/common";
import { useState, useEffect, useCallback } from "react"
import { Image, useWindowDimensions } from "react-native"
import { styled } from "styled-components/native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { colorPalette } from "../styles/styles";
import { PokedexDetailsMenu } from "../components/selectPokedex/pokedexDetailsMenu";

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

const PokedexCard = styled(TouchableOpacity)`
  aspect-ratio: 0.8;

  background-color: ${colorPalette.foregroundButtonBlackInactive};
  margin: 10px;
  border-radius: 10px;

  padding: 10px;

  display: flex;
  align-items: center;
  justify-content: center;
`

const PokedexGenIncludeText = styled.Text`

  width: 100%;
  text-align: center;
  margin: 5px;
  font-size: 12px;

  color: ${colorPalette.textWhite};
`

const PokedexNameDisplay = styled.Text`

  width: 100%;
  text-align: center;

  font-size: 16px;

  color: ${colorPalette.textWhite};
  font-weight: bold;
`

const ScrollableDexView = styled(ScrollView).attrs({
  contentContainerStyle: {
    display: "flex",
    flexDirection: "row",
    flexWrap: "wrap",

    justifyContent: "center",
    alignContent: "center",
  },
})`
`

export function SelectPokedexScreen(_: NativeStackScreenProps<RootStackParamList, 'SelectPokedexScreen'>) {
  // const [pokeTeams, setPokeTeams] = useLocalStorage<Pokemon[]>("poketeam", []);

  // const addNewPoketoTeam = useCallback(() => {
  //   setPokeTeams(prev => [...prev, allPokemon[0]])
  // }, [setPokeTeams]);

  const [isDetailsShown, setIsDetailsShown] = useState(false);

  const dissmissDetails = useCallback(() => {
    setIsDetailsShown(false);
  }, [setIsDetailsShown])

  const screenWidth = useWindowDimensions().width;

  return (
    <>

      <Body>
        <HeaderText style={{}}>
          Choose Pokedex
        </HeaderText>

        <HorizontalBottomRule />

        <ScrollableDexView >
          <PokedexCard style={{ width: screenWidth / 3 }} onPress={() => { setIsDetailsShown(true) }}>
            <Image source={require('../icons/globe-icon.png')} resizeMode="contain" style={{ flex: 1, width: "100%", height: undefined }} />

            <PokedexGenIncludeText> All Generations </PokedexGenIncludeText>
            <PokedexNameDisplay> National Dex </PokedexNameDisplay>
          </PokedexCard>

          <PokedexCard style={{ width: screenWidth / 3 }} >
            <Image source={require('../icons/caught_indicator.png')} resizeMode="contain" style={{ flex: 1, width: "100%", height: undefined }} />

            <PokedexGenIncludeText> Gen 1-5, Gen 2-7 </PokedexGenIncludeText>
            <PokedexNameDisplay> Unbound Dex </PokedexNameDisplay>
          </PokedexCard>
          <PokedexCard style={{ width: screenWidth / 3 }} />
          <PokedexCard style={{ width: screenWidth / 3 }} />
        </ScrollableDexView>




        <AddPokeButton onPress={() => { console.log("add rpess") }}>
          <Image source={require('../icons/cross.png')} style={{ height: "50%", width: "50%", transform: [{ rotateZ: "45deg" }] }} />
        </AddPokeButton>

      </Body>

      {isDetailsShown && <PokedexDetailsMenu dissmiss={dissmissDetails} />}
    </>

  )
}