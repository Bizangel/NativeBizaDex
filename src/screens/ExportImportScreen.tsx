import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../App";
import { styled } from "styled-components/native";
import { colorPalette } from "../styles/styles";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useCallback } from "react"
import { Image } from "react-native"
import useTypedNavigation from "../hooks/useTypedNavigation";
import { HorizontalBottomRule } from "../common/common";
import { SerializeStore } from "../util/exportimport";


const Body = styled.View`
  width: 100%;
  height: 100%;
  background-color: ${colorPalette.backgroundBlack};

  display: flex;
  flex-direction: column;

  align-items: center;

  padding: 20px;
`

const CloseButtonWrapper = styled(TouchableOpacity).attrs({
  containerStyle: { width: 30, height: 30, position: "absolute", top: 0, right: 0, margin: 10 }
})`
  width: 100%;
  height: 100%;

  z-index: 1;
`

const HeaderText = styled.Text`
  margin-top: 10px;

  font-size: 25px;
  color: ${colorPalette.textWhite};
`

const ButtonWrapper = styled(TouchableOpacity)`
  background-color: ${colorPalette.foregroundButtonBlackActive};

  padding: 5px;
  border-radius: 10px;
  margin-top: 15px;

`

const ButtonText = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 18px;
`

const SmallTextExpl = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 12px;

  width: 80%;
  text-align: justify;
`

function Button({ text, onPress }: { text: string, onPress?: () => void }) {
  return (
    <ButtonWrapper onPress={onPress}>
      <ButtonText>
        {text}
      </ButtonText>
    </ButtonWrapper>)
}

function ExportImportScreen(_: NativeStackScreenProps<RootStackParamList, 'ExportImportScreen'>) {

  const navigation = useTypedNavigation();
  const closeExportImportScreen = useCallback(() => { navigation.pop() }, [navigation])

  const exportViaClipboard = () => {
    SerializeStore();
  }

  return (
    <Body>

      <HeaderText>
        Export Data
      </HeaderText>
      <HorizontalBottomRule />

      <CloseButtonWrapper onPress={closeExportImportScreen}>
        <Image source={require('../icons/cross.png')} resizeMode="contain" style={{ width: "100%", height: "100%" }} />
      </CloseButtonWrapper>

      <Button text="Export via Share" />
      <Button text="Export to Clipboard" onPress={exportViaClipboard} />

      <HeaderText>
        Import Data
      </HeaderText>
      <HorizontalBottomRule />


      <SmallTextExpl>
        To import data via share, share the exported file and open with this app.
        Similar to how you share a picture, and choose an app as a target to share with.
      </SmallTextExpl>

      <Button text="Import Via Clipboard" />

    </Body>
  );
}

export default ExportImportScreen;