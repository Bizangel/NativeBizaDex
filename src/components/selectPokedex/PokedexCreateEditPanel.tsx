import { styled } from "styled-components/native"
import DirectionalSlidingMenu, { DirectionalSlidingMenuRef } from "../../common/DirectionalSlidingMenu"
import { HorizontalBottomRule, TextInputWithBlurOnHide } from "../../common/common"
import { GenFilterSection } from "../filterMenuComponents/GenFilterSection"
import { useCallback, useRef, useState } from "react"
import { Alert } from "react-native"
import { PokeFilter, StoredPokedex, initialPokefilter } from "../../common/pokeInfo"
import { colorPalette } from "../../styles/styles"
import { Image } from "react-native"
import { ScrollView, TouchableOpacity } from "react-native-gesture-handler"
import uuid from 'react-native-uuid';
import { usePersistentStorage } from "../../localstore/storage"

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

function verifyPokedexName(name: string) {
  if (name.length === 0) {
    Alert.alert('Empty Pokedex Name', "Pokedex Name cannot be empty!")
    return false;
  }

  if (name.length < 3) {
    Alert.alert('Invalid Pokedex Name', "Name is too short, must be at least three characters long!")
    return false;
  }

  if (name.length > 20) {
    Alert.alert('Invalid Pokedex Name', "Name is too long, must be at most 20 characters long!")
    return false;
  }

  return true;
}

export type PokedexDetailsMenuProps = {
  dissmiss: () => void,

  /** Whether or not to be editing, set empty to create new pokedex. */
  editingPokedex: StoredPokedex | null,
}

export function PokedexCreateEditPanel({ dissmiss, editingPokedex }: PokedexDetailsMenuProps) {
  const isEditing = editingPokedex !== null;

  const slidingMenuRef = useRef<DirectionalSlidingMenuRef>(null);
  const storeNewPokedex = usePersistentStorage(e => e.storeNewPokedex);
  const removePokedexByID = usePersistentStorage(e => e.removeStoredPokedexByID);
  const renameStoredDex = usePersistentStorage(e => e.renameStoredPokedex);

  const [genFilter, setGenFilter] = useState<PokeFilter["genFilter"]>(editingPokedex ? editingPokedex.genFilter : initialPokefilter.genFilter);
  const [pokedexNameField, setPokedexNameField] = useState(editingPokedex?.pokedexName ?? "");

  const onRenamePress = useCallback(() => {
    if (editingPokedex) {
      if (!verifyPokedexName(pokedexNameField)) {
        return;
      }

      renameStoredDex(editingPokedex.pokedexId, pokedexNameField)
      slidingMenuRef.current?.closeOverlay();
    }
  }, [renameStoredDex, editingPokedex, pokedexNameField, slidingMenuRef])

  const createPokedex = useCallback(() => {
    if (!verifyPokedexName(pokedexNameField)) {
      return;
    }

    if (!genFilter.some(e => e)) {
      Alert.alert('Invalid Gen Filter', "Please select at least one generation")
      return;
    }

    const newPokedexToAdd: StoredPokedex = {
      pokedexId: `${uuid.v4()}`,
      pokedexName: pokedexNameField,
      genFilter: genFilter,
      caughtPokemon: [],
    }

    storeNewPokedex(newPokedexToAdd)
    slidingMenuRef.current?.closeOverlay();
  }, [pokedexNameField, genFilter, storeNewPokedex])

  const deletePokedex = useCallback(() => {
    Alert.alert('Delete Pokedex', `Delete ${editingPokedex?.pokedexName}?`, [
      {
        text: 'Cancel',
        style: 'cancel',
      },
      {
        text: 'Delete',
        style: 'cancel',
        onPress: () => { removePokedexByID(editingPokedex?.pokedexId ?? ""); slidingMenuRef.current?.closeOverlay(); }
      },
    ], { cancelable: true })
    return;
  }, [editingPokedex, removePokedexByID, slidingMenuRef])


  return <DirectionalSlidingMenu
    ref={slidingMenuRef}
    dismissLayout={dissmiss}
    menuViewportSize={80}
    slidingOrigin="bottom"
  >
    <DetailsWrapper >

      {isEditing &&
        <DeleteButtonWrapper onPress={deletePokedex}>
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

      {!isEditing &&
        <BottomBigActionButton onPress={createPokedex}>
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