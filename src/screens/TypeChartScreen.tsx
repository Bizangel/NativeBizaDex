import { styled } from "styled-components/native";
import { RootStackParamList } from "../App";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colorPalette, types2color } from "../styles/styles";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useCallback } from "react"
import { Image } from "react-native"
import useTypedNavigation from "../hooks/useTypedNavigation";
import { PokemonTypes } from "../common/pokeInfo";
import { ProgressiveRenderer, ProgressiveRendererRenderItem } from "../common/ProgressiveRenderer";
import { PokeType } from "../types/Pokemon";

const tableRowHeight = "50px";
const tableRowWidth = "70px"

const Body = styled.View`
  width: 100%;
  height: 100%;

  background-color: ${colorPalette.backgroundBlack};

  display: flex;
  align-items: center;
  justify-content: flex-end;
`

const CloseButtonWrapper = styled(TouchableOpacity).attrs({
  containerStyle: { width: 30, height: 30, position: "absolute", top: 0, right: 0, margin: 10 }
})`
  width: 100%;
  height: 100%;

  z-index: 1;
`

const TypeTableWrapper = styled.View`
  position: relative;

  width: 100%;
  height: 90%;
`

const TypeTableScrollVertical = styled(ScrollView)`
  position: relative;

  width: 100%;
  height: 100%;
`

const TypeTableScrollableWrapper = styled(ScrollView)`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;

  margin-left: ${tableRowWidth};
`

const TableColWrapper = styled.View`
  display: flex;
  flex-direction: column;
`

const TypeDisplayEntryInternalText = styled.Text`
  color: ${colorPalette.textWhite};
  text-shadow: 1px 1px 2px rgba(0,0,0,.7);
  text-align: center;

  text-transform: uppercase;
  padding: 2px;

  font-size: 12px;
`

const TypeDisplayEntryInternal = styled.View<{ type: PokeType }>`
  display: flex;
  justify-content: center;
  align-content: center;

  background-color: ${p => types2color[p.type]};
  width: ${tableRowWidth};
  height: ${tableRowHeight};
`
function TypeDisplayEntry({ type }: { type: PokeType }) {

  return (
    <TypeDisplayEntryInternal type={type}>
      <TypeDisplayEntryInternalText >{type}</TypeDisplayEntryInternalText>
    </TypeDisplayEntryInternal>
  )
}

const TableEntry = styled.View`
  height: ${tableRowHeight};
  width: ${tableRowWidth};

  border-width: 1px;
  border-color: black;
`

const TableTypeHeader = styled.View`
  display: flex;
  flex-direction: row;
  margin-left: ${tableRowWidth};
`

const TableTypeLeftColumn = styled.View`
  position: absolute;
  top: ${tableRowHeight};
  left: 0;

  display: flex;
  flex-direction: column;
`


function TypeChartScreen(_: NativeStackScreenProps<RootStackParamList, 'TypeChartScreen'>) {

  const navigation = useTypedNavigation()
  const onCloseButtonPress = useCallback(() => {
    navigation.pop();
  }, [navigation])

  const renderCol: ProgressiveRendererRenderItem<PokeType> = useCallback((type) => {
    return (
      <TableColWrapper>
        {
          PokemonTypes.map((_2, idx2) =>
            <TableEntry key={idx2} />
          )
        }
      </TableColWrapper>
    )
  }, [])

  return (
    <Body>
      <CloseButtonWrapper onPress={onCloseButtonPress}>
        <Image source={require('../icons/cross.png')} resizeMode="contain" style={{ width: "100%", height: "100%" }} />
      </CloseButtonWrapper>

      <TypeTableWrapper>
        <TypeTableScrollVertical stickyHeaderIndices={[0]}>
          {/* Atop column type display, part of layout, and is instead stickied by sticky index*/}

          <TableTypeHeader>
            {PokemonTypes.map((e, idx) =>
              <TypeDisplayEntry type={e} key={idx} />
            )}
          </TableTypeHeader>

          {/* Atop left column type display, NOT part of layout. stickied by absolute. */}
          <TableTypeLeftColumn>
            {PokemonTypes.map((e, idx) =>
              <TypeDisplayEntry type={e} key={idx} />
            )}
          </TableTypeLeftColumn>



          <TypeTableScrollableWrapper horizontal>
            <ProgressiveRenderer
              style={{ display: "flex", flexDirection: "row" }}
              fullData={PokemonTypes}
              renderItem={renderCol}
              animatedOpacitySpawnDuration={200}
            />
          </TypeTableScrollableWrapper>

        </TypeTableScrollVertical>
      </TypeTableWrapper>

    </Body>
  )
}

export default TypeChartScreen;