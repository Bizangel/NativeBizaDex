import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { styled } from "styled-components/native";
import { colorPalette } from "../../styles/styles";
import { TextInputWithBlurOnHide, ascendingFilterIcon2Image, topBarHeightPx } from "../../common/common";
import { usePokedataStore } from "../../actions/pokedata";


const TopbarWrapper = styled.View`
  z-index: 1;

  background-color: rgba(33, 46, 51, 0.698);

  height: ${topBarHeightPx}px;
  width: 100%;

  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;

  padding: 0px 20px;
`

const SearchBarWrapper = styled.View`
  flex: 1;
  background-color: rgba(33, 46, 51, .7);

  border-radius: 20px;
`

const SearchInput = styled(TextInputWithBlurOnHide)`
  font-size: 16px;


  color: ${colorPalette.textWhite};

  padding: 5px;
  padding-left: 10px;
  border-radius: 10px;
`


const EnabledFilterIndicatorWrapper = styled.View`
  color: ${colorPalette.textWhite};

  width: 20px;
  height: 20px;

  border-radius: 10px;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: ${colorPalette.notSoBrightRed};
  position: absolute;

  right: 0;
  top: 0;
`

const EnabledFilterIndicatorText = styled.Text`
  font-size: 10px;

  color: ${colorPalette.textWhite};
`

export type TopBarProps = {
  currentSearch: string,
  setCurrentSearch: (x: string) => void,
  onFilterPress: () => void,
  onSortingPress: () => void,
  onBurgerBarPress: () => void,
  displayFilterIndicator: boolean,
}

function TopBar({ currentSearch, setCurrentSearch, onFilterPress, onBurgerBarPress, onSortingPress, displayFilterIndicator }: TopBarProps) {
  const currentAscending = usePokedataStore(e => e.currentSorting.ascending);

  return (
    <TopbarWrapper>

      <TouchableOpacity onPress={onBurgerBarPress}>
        <Image source={require('../../icons/burgerbar.png')} style={{ width: 30, height: 30 }} resizeMode="contain" />
      </TouchableOpacity>

      <SearchBarWrapper>
        <SearchInput
          placeholder="Search"
          placeholderTextColor="#dddddd"
          onChangeText={(x: string) => setCurrentSearch(x)}
          value={currentSearch}
          defaultValue={""}
        />
      </SearchBarWrapper>

      <TouchableOpacity onPress={onSortingPress} style={{ marginRight: 15 }}>
        <Image source={ascendingFilterIcon2Image(currentAscending)} style={{ width: 30, height: 30 }} resizeMode="contain" />
      </TouchableOpacity>

      <TouchableOpacity onPress={onFilterPress}>
        <Image source={require('../../icons/filter.png')} style={{ width: 40, height: 40 }} />

        {displayFilterIndicator &&
          <EnabledFilterIndicatorWrapper>
            <EnabledFilterIndicatorText>
              ON
            </EnabledFilterIndicatorText>
          </EnabledFilterIndicatorWrapper>
        }
      </TouchableOpacity>


    </TopbarWrapper>
  )
}

export default TopBar