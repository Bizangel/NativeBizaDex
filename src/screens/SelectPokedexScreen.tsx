import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { HorizontalBottomRule, LocalStorageKeys } from "../common/common";
import { useState, useCallback } from "react"
import { Image, useWindowDimensions } from "react-native"
import { styled } from "styled-components/native";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { colorPalette } from "../styles/styles";
import { PokedexCreateEditPanel } from "../components/selectPokedex/PokedexCreateEditPanel";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { StoredPokedex } from "../common/pokeInfo";
import { generateRangesWithPrefix } from "../util/utils";

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
  const [storedPokedexes, setStoredPokedex] = useLocalStorage<StoredPokedex[]>(LocalStorageKeys.STORED_POKEDEX, []);
  // undefined is no menu shown. null is create new pokedex, specify one and it's edit
  const [pokedexDetails, setCurrentPokedexDetails] = useState<StoredPokedex | null | undefined>(undefined);

  const showCreateNewPokedexPanel = useCallback(() => {
    setCurrentPokedexDetails(null)
  }, [setCurrentPokedexDetails])

  const showEditPokedexPanel = useCallback((val: StoredPokedex) => {
    setCurrentPokedexDetails(val)
  }, [setCurrentPokedexDetails])

  const dissmissDetails = useCallback(() => {
    setCurrentPokedexDetails(undefined);
  }, [setCurrentPokedexDetails])

  const screenWidth = useWindowDimensions().width;

  return (
    <>

      <Body>
        <HeaderText style={{}}>
          Choose Pokedex
        </HeaderText>

        <HorizontalBottomRule />

        <ScrollableDexView >
          {/* Base Pokedex containing all mons */}
          <PokedexCard style={{ width: screenWidth / 3 }}>
            <Image source={require('../icons/globe-icon.png')} resizeMode="contain" style={{ flex: 1, width: "100%", height: undefined }} />

            <PokedexGenIncludeText> All Generations </PokedexGenIncludeText>
            <PokedexNameDisplay> National Dex </PokedexNameDisplay>
          </PokedexCard>

          {/*  Custom Pokedex */}

          {
            storedPokedexes.map(e =>
              <PokedexCard style={{ width: screenWidth / 3 }} key={e.pokedexId} onPress={() => { showEditPokedexPanel(e) }}>
                <Image source={require('../icons/caught_indicator.png')} resizeMode="contain" style={{ flex: 1, width: "100%", height: undefined }} />

                <PokedexGenIncludeText> {generateRangesWithPrefix(e.genFilter, "Gen")} </PokedexGenIncludeText>
                <PokedexNameDisplay> {e.pokedexName} </PokedexNameDisplay>
              </PokedexCard>
            )
          }

        </ScrollableDexView>




        <AddPokeButton onPress={showCreateNewPokedexPanel}>
          <Image source={require('../icons/cross.png')} style={{ height: "50%", width: "50%", transform: [{ rotateZ: "45deg" }] }} />
        </AddPokeButton>

      </Body>

      {pokedexDetails !== undefined && <PokedexCreateEditPanel dissmiss={dissmissDetails} setStoredPokedex={setStoredPokedex} editingPokedex={pokedexDetails} />}
    </>

  )
}