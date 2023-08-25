import { styled } from "styled-components/native";
import { RootStackParamList } from "../App";
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { colorPalette, types2color } from "../styles/styles";
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler";
import { useCallback, useRef } from "react"
import { Image, NativeSyntheticEvent, NativeScrollEvent } from "react-native"
import useTypedNavigation from "../hooks/useTypedNavigation";
import { PokemonTypes, TypeChart, TypeEffectiveness } from "../common/pokeInfo";
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

const TypeChartHeader = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 24px;

  margin-bottom: 20px;
  text-align: left;
  width: 80%;
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
`

const TypeTableScrollableWrapper = styled(ScrollView)`
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

  display: flex;
  justify-content: center;
  align-items: center;
`

const TableEntryText = styled.Text`
  font-size: 16px;
  color: ${colorPalette.textWhite};

  font-weight: bold;
`

const TableTypeHeader = styled.View`
  z-index: 1;

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

const effectiveness2color: Record<TypeEffectiveness, string> = {
  "0": "black",
  "1/2": colorPalette.notVeryEffectiveRed,
  "2": colorPalette.superEffectiveGreen,
  "1": colorPalette.backgroundBlack,
}

function TypeChartScreen(_: NativeStackScreenProps<RootStackParamList, 'TypeChartScreen'>) {

  const topBarHorizontalScroll = useRef<ScrollView>(null);

  const navigation = useTypedNavigation()
  const onCloseButtonPress = useCallback(() => {
    navigation.pop();
  }, [navigation])

  const renderCol: ProgressiveRendererRenderItem<number> = useCallback((colIdx) => {
    return (
      <TableColWrapper>
        {
          PokemonTypes.map((_2, rowIdx) =>
            <TableEntry key={rowIdx} style={{ backgroundColor: effectiveness2color[TypeChart[rowIdx][colIdx]] }}>
              <TableEntryText>
                {TypeChart[rowIdx][colIdx] !== "1" && `x${TypeChart[rowIdx][colIdx]}`}
              </TableEntryText>
            </TableEntry>
          )
        }
      </TableColWrapper>
    )
  }, [])

  // sync the upper type bar scrollbar with the one below. (making it semi-sticky?)
  const onContentHorizontalScroll = useCallback((ev: NativeSyntheticEvent<NativeScrollEvent>) => {
    topBarHorizontalScroll.current?.scrollTo({ animated: false, x: ev.nativeEvent.contentOffset.x })
  }, [topBarHorizontalScroll])

  return (
    <Body>
      <CloseButtonWrapper onPress={onCloseButtonPress}>
        <Image source={require('../icons/cross.png')} resizeMode="contain" style={{ width: "100%", height: "100%" }} />
      </CloseButtonWrapper>

      <TypeChartHeader>
        Type Effectiveness Chart
      </TypeChartHeader>

      <TypeTableWrapper>
        <TypeTableScrollVertical stickyHeaderIndices={[0]}>

          <TableTypeHeader>
            <ScrollView horizontal ref={topBarHorizontalScroll} scrollEnabled={false} showsHorizontalScrollIndicator={false}>
              {PokemonTypes.map((e, idx) =>
                <TypeDisplayEntry type={e} key={idx} />
              )}
            </ScrollView>
          </TableTypeHeader>


          {/* Atop left column type display, NOT part of layout. stickied by absolute. */}

          <TableTypeLeftColumn>
            {PokemonTypes.map((e, idx) =>
              <TypeDisplayEntry type={e} key={idx} />
            )}
          </TableTypeLeftColumn>

          <TypeTableScrollableWrapper horizontal onScroll={onContentHorizontalScroll}>
            {/* Atop column type display, part of layout, and is instead stickied by sticky index*/}
            <ProgressiveRenderer
              style={{ display: "flex", flexDirection: "row" }}
              fullData={PokemonTypes.map((e, idx) => idx)}
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