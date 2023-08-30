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


const CreatePokedexButton = styled(TouchableOpacity).attrs({
  containerStyle: { marginTop: 20, marginBottom: 20, }
})`
  background-color: ${colorPalette.foregroundButtonBlackFull};
  border-radius: 10px;
  padding: 7px;
`

const CreatePokedexButtonText = styled.Text`
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

  setStoredPokedex: React.Dispatch<React.SetStateAction<StoredPokedex[]>>,

  /** Whether or not to be editing, set empty to create new pokedex. */
  editingPokedex: StoredPokedex | null,
}

export function PokedexCreateEditPanel({ dissmiss, setStoredPokedex, editingPokedex }: PokedexDetailsMenuProps) {
  const isEditing = editingPokedex !== null;

  const slidingMenuRef = useRef<DirectionalSlidingMenuRef>(null);
  const [genFilter, setGenFilter] = useState<PokeFilter["genFilter"]>(editingPokedex ? editingPokedex.genFilter : initialPokefilter.genFilter);
  const [pokedexNameField, setPokedexNameField] = useState("");

  const storeNewPokedex = useCallback((newPokedex: StoredPokedex) => {
    setStoredPokedex(prev => [...prev, newPokedex])
  }, [setStoredPokedex])

  const createPokedex = useCallback(() => {
    if (pokedexNameField.length < 3) {
      Alert.alert('Invalid Pokedex Name', "Name is too short, must be at least three characters long!")
      return;
    }

    if (pokedexNameField.length > 20) {
      Alert.alert('Invalid Pokedex Name', "Name is too long, must be at most 20 characters long!")
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
        onPress: () => { setStoredPokedex(prev => prev.filter(e => e.pokedexId !== editingPokedex?.pokedexId)); slidingMenuRef.current?.closeOverlay(); }
      },
    ], { cancelable: true })
    return;
  }, [editingPokedex, setStoredPokedex, slidingMenuRef])


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
        <CreatePokedexButton onPress={createPokedex}>
          <CreatePokedexButtonText>
            Create Pokedex
          </CreatePokedexButtonText>
        </CreatePokedexButton>
      }

    </DetailsWrapper>
  </DirectionalSlidingMenu>
}