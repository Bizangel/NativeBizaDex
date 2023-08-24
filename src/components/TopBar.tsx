import { Image } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { styled } from "styled-components/native";
import { colorPalette } from "../styles/styles";


const TopbarWrapper = styled.View`
  z-index: 1;

  background-color: rgba(33, 46, 51, 0.698);

  height: 50px;
  width: 100%;

  display: flex;
  flex-direction: row;

  align-items: center;
  justify-content: space-between;

  padding: 0px 20px;
`

const SearchBarWrapper = styled.View`
  width: 75%;
  background-color: rgba(33, 46, 51, .7);

  border-radius: 20px;
  margin: 5px 0px;
`

const SearchInput = styled.TextInput`
  font-size: 16px;
  padding-left: 15px;

  /* color: rgb(200,200,200); */
  color: ${colorPalette.textWhite};
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
  onFilterClick: () => void,

  displayFilterIndicator: boolean,
}

function TopBar({ currentSearch, setCurrentSearch, onFilterClick, displayFilterIndicator }: TopBarProps) {

  return (
    <TopbarWrapper>
      <SearchBarWrapper>
        <SearchInput
          placeholder="Search"
          placeholderTextColor="#dddddd"
          onChangeText={(x: string) => setCurrentSearch(x)}
          value={currentSearch}
          defaultValue={""}
        />
      </SearchBarWrapper>


      <TouchableOpacity onPress={onFilterClick}>
        <Image source={require('../icons/filter.png')} style={{ width: 40, height: 40 }} />

        {displayFilterIndicator && <EnabledFilterIndicatorWrapper>
          <EnabledFilterIndicatorText>
            ON
          </EnabledFilterIndicatorText>
        </EnabledFilterIndicatorWrapper>}
      </TouchableOpacity>


    </TopbarWrapper>
  )
}

export default TopBar