import { styled } from "styled-components/native"
import DirectionalSlidingMenu from "../../common/DirectionalSlidingMenu"
import { HorizontalBottomRule, TextInputWithBlurOnHide } from "../../common/common"
import { GenFilterSection } from "../filterMenuComponents/GenFilterSection"
import { StoredPokedex } from "../../common/pokeInfo"
import { colorPalette } from "../../styles/styles"
import { Image } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import usePokedexCreateEditPanelService from "./PokedexCreateEditPanel.service"

const DetailsWrapper = styled(ScrollView).attrs({
  contentContainerStyle: {
    display: "flex",

    justifyContent: "flex-start",
    alignItems: "center",
    padding: 10,
  },
})`
  width: 100%;
  height: 100%;

  background-color: ${colorPalette.backgroundBlack};
`

const PokedexNameInput = styled(TextInputWithBlurOnHide)`
  background-color: ${colorPalette.foregroundButtonBlackInactive};
  border-radius: 10px;

  margin: 10px 0px;
  width: 60%;
  padding-left: 5px;
`

const GenFilterWrapper = styled.View`
  width: 70%;

  display: flex;
  flex-direction: column;
  align-items: center;
`

const DetailsPokedexHeader = styled.Text`
  text-align: center;

  font-size: 24px;

  color: ${colorPalette.textWhite};
`

const DetailsSubHeader = styled.Text`
  text-align: center;
  font-size: 12px;
  color: ${colorPalette.textWhite};

  width: 80%;
`

const SubHeader = styled.Text`
  width: 80%;
  text-align: left;

  font-size: 24px;

  color: ${colorPalette.textWhite};
`

const IncludeVariantsButtonRow = styled.View`

  margin-top: 15px;
  display: flex;
  flex-direction: row;
`

const IncludeVariantButton = styled(TouchableOpacity) <{ isActive: boolean }>`
  width: 150px;

  padding: 7px;

  background-color: ${p => p.isActive ? colorPalette.foregroundButtonBlackActive : colorPalette.foregroundButtonBlackInactive};
  border-radius: 10px;
`

const IncludeVariantButtonText = styled.Text`
  color: ${colorPalette.textWhite};
  font-size: 15px;

  text-align: center;
`


const BottomBigActionButton = styled(TouchableOpacity).attrs({
  containerStyle: { marginTop: 20, marginBottom: 20, }
})`
  background-color: ${colorPalette.foregroundButtonBlackFull};
  border-radius: 10px;
  padding: 7px;
`

const BottomBigActionButtonText = styled.Text`
  font-size: 18px;
  color: ${colorPalette.textWhite};
`

const DeleteButtonWrapper = styled(TouchableOpacity).attrs({
  containerStyle: {
    position: "absolute",
    width: 30,
    height: 30,

    top: 0,
    right: 0,
    marginRight: 10,
    marginTop: 10,
  }
})`
  position: absolute;
  width: 100%;
  height: 100%;
`

export type PokedexDetailsMenuProps = {
  dissmiss: () => void,

  /** Whether or not to be editing, set empty to create new pokedex. */
  editingPokedex: StoredPokedex | null,
}

export function PokedexCreateEditPanel({ dissmiss, editingPokedex }: PokedexDetailsMenuProps) {
  const isEditing = editingPokedex !== null;

  const { onCreatePokedexPress, onRenamePress, onDeletePokedexPress,
    pokedexNameField, setPokedexNameField,
    genFilter, setGenFilter, slidingMenuRef,
    includeVariantInCreation, onIncludePokeVariantPress, onExcludePokeVariantPress
  } = usePokedexCreateEditPanelService(editingPokedex);

  return <DirectionalSlidingMenu
    ref={slidingMenuRef}
    dismissLayout={dissmiss}
    menuViewportSize={80}
    slidingOrigin="bottom"
  >
    <DetailsWrapper >
      {isEditing &&
        <DeleteButtonWrapper onPress={onDeletePokedexPress}>
          <Image source={require('../../icons/delete-bin-icon.png')} resizeMode="contain" style={{ flex: 1, width: "100%", height: undefined }} />
        </DeleteButtonWrapper>
      }


      <DetailsPokedexHeader>
        {isEditing ? `${editingPokedex.pokedexName}` : "Create New Pokedex"}
      </DetailsPokedexHeader>

      <DetailsSubHeader>
        Only the name field is modifiable. Please create another pokedex to change the generational filters.
      </DetailsSubHeader>

      <SubHeader>
        Name
      </SubHeader>
      <HorizontalBottomRule />

      <PokedexNameInput
        value={pokedexNameField}
        onChangeText={(e: string) => setPokedexNameField(e)}
        placeholder="Kanto Pokedex" />

      <SubHeader>
        Generational Pokemon
      </SubHeader>

      <HorizontalBottomRule />

      <GenFilterWrapper>
        <GenFilterSection currentFilter={genFilter} setCurrentFilter={isEditing ? () => { } : setGenFilter} hideToggleAll={isEditing} disableTouchableFeedback={isEditing} />
      </GenFilterWrapper>

      <IncludeVariantsButtonRow>
        <IncludeVariantButton isActive={includeVariantInCreation} style={{ marginRight: 15 }} onPress={onIncludePokeVariantPress}
          activeOpacity={isEditing ? 1 : 0.2}
        >
          <IncludeVariantButtonText>Include Pokemon Variants</IncludeVariantButtonText>
        </IncludeVariantButton>

        <IncludeVariantButton isActive={!includeVariantInCreation} onPress={onExcludePokeVariantPress}
          activeOpacity={isEditing ? 1 : 0.2}
        >
          <IncludeVariantButtonText>Exclude Pokemon Variants</IncludeVariantButtonText>
        </IncludeVariantButton>
      </IncludeVariantsButtonRow>

      {!isEditing &&
        <BottomBigActionButton onPress={onCreatePokedexPress}>
          <BottomBigActionButtonText>
            Create Pokedex
          </BottomBigActionButtonText>
        </BottomBigActionButton>
      }

      {isEditing &&
        <BottomBigActionButton onPress={onRenamePress}>
          <BottomBigActionButtonText>
            Rename Pokedex
          </BottomBigActionButtonText>
        </BottomBigActionButton>
      }

    </DetailsWrapper>
  </DirectionalSlidingMenu>
}