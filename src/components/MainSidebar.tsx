import HorizontalSlidingMenu, { HorizontalSlidingMenuRef } from "../common/HorizontalSlidingMenu";
import styled from "styled-components/native";
import { colorPalette } from "../styles/styles";
import { HorizontalBottomRule } from "../common/common";
import { Image, ImageSourcePropType } from "react-native"
import { TouchableOpacity } from "react-native-gesture-handler";
import { useCallback, useRef } from "react";
import useTypedNavigation from "../hooks/useTypedNavigation";

const MainSideMenuHeader = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 24px;

  text-align: center;
`

const MainSideMenuSubHeader = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 12px;

  text-align: center;
`

const SidebarWrapper = styled.View`
  padding: 10px;

  background-color: ${colorPalette.backgroundBlack};

  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const SectionButtonWrapper = styled(TouchableOpacity).attrs({
  containerStyle: { // this is the OUTER container.
    width: "100%",
    height: 50,
    marginTop: 15,
  },
})`
  width: 100%;
  height: 100%;

  display: flex;
  flex-direction: row;
  /* justify-content: space-evenly; */
  align-items: center;

  border-width: 2px;
  border-color: ${colorPalette.buttonBorderColor};
  border-radius: 5px;
`
const SectionButtonText = styled.Text`
  margin-left: 15px;

  color: ${colorPalette.textWhite};
  font-size: 16px;

  text-align: center;
`

function SectionButtonLink({ text, onPress, iconSource }: { text: string, onPress?: () => void, iconSource: ImageSourcePropType }) {
  return (
    <SectionButtonWrapper onPress={onPress}>
      <Image source={iconSource} resizeMode="contain" style={{ height: "75%", aspectRatio: 1, width: undefined, marginLeft: 10 }} />
      <SectionButtonText>{text}</SectionButtonText>
    </SectionButtonWrapper >
  )
}

export type MainSidebarProps = {
  dissmissMenu: () => void,
}

function MainSidebar({ dissmissMenu }: MainSidebarProps) {
  const slidingRef = useRef<HorizontalSlidingMenuRef>(null);

  const navigation = useTypedNavigation();


  const closeMenuAnimated = useCallback(() => {
    slidingRef.current?.closeOverlay();
  }, [slidingRef])

  const navigateToAllAbilitiesScreen = useCallback(() => {
    navigation.push("AllAbilitiesScreen", {})
  }, [navigation])

  const navigateToTypechartTable = useCallback(() => {
    navigation.push("TypeChartScreen", {})
  }, [navigation])

  return (
    <HorizontalSlidingMenu
      dismissLayout={dissmissMenu}
      slidingOrigin="left"
      menuViewportSize={60}
      ref={slidingRef}
    >
      <SidebarWrapper>
        <MainSideMenuHeader>
          Biza's Native Dex
        </MainSideMenuHeader>
        <MainSideMenuSubHeader>
          Thanks for checking out the app!
        </MainSideMenuSubHeader>
        <HorizontalBottomRule />

        <SectionButtonLink text="All Pokemon" iconSource={require('../icons/list_icon.png')} onPress={closeMenuAnimated} />

        <SectionButtonLink text="Pokemon Abilities" iconSource={require('../icons/ability_icon.png')} onPress={navigateToAllAbilitiesScreen} />

        <SectionButtonLink text="Team Builder" iconSource={require('../icons/teambuilder_icon.png')} />

        <SectionButtonLink text="Type Chart Table" iconSource={require('../icons/typetable_icon.png')} onPress={navigateToTypechartTable} />

        <SectionButtonLink text="Caught Pokemon" iconSource={require('../icons/caught_indicator.png')} />

      </SidebarWrapper>
    </HorizontalSlidingMenu>
  )
}


export default MainSidebar;