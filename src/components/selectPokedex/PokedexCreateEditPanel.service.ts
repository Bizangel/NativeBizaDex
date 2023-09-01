import { useCallback, useState, useRef } from "react"
import { PokeFilter, StoredPokedex, initialPokefilter } from "../../common/pokeInfo";
import { usePersistentStorage } from "../../localstore/storage";
import { DirectionalSlidingMenuRef } from "../../common/DirectionalSlidingMenu";
import uuid from 'react-native-uuid';
import { Alert } from "react-native"

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


function usePokedexCreateEditPanelService(editingPokedex: StoredPokedex | null) {
  const slidingMenuRef = useRef<DirectionalSlidingMenuRef>(null);

  const storeNewPokedex = usePersistentStorage(e => e.storeNewPokedex);
  const removePokedexByID = usePersistentStorage(e => e.removeStoredPokedexByID);
  const renameStoredDex = usePersistentStorage(e => e.renameStoredPokedex);
  const [pokedexNameField, setPokedexNameField] = useState(editingPokedex?.pokedexName ?? "");
  const [genFilter, setGenFilter] = useState<PokeFilter["genFilter"]>(editingPokedex ? editingPokedex.genFilter : initialPokefilter.genFilter);
  const [includeVariantInCreation, setIncludeVariantInCreation] = useState<boolean>(editingPokedex?.hidePokeVariants ?? false);

  const onIncludePokeVariantPress = useCallback(() => { if (!editingPokedex) setIncludeVariantInCreation(true); }, [setIncludeVariantInCreation, editingPokedex]);
  const onExcludePokeVariantPress = useCallback(() => { if (!editingPokedex) setIncludeVariantInCreation(false) }, [setIncludeVariantInCreation, editingPokedex]);

  const onRenamePress = useCallback(() => {
    if (editingPokedex) {
      if (!verifyPokedexName(pokedexNameField)) {
        return;
      }

      renameStoredDex(editingPokedex.pokedexId, pokedexNameField)
      slidingMenuRef.current?.closeOverlay();
    }
  }, [renameStoredDex, editingPokedex, pokedexNameField, slidingMenuRef])

  const onCreatePokedexPress = useCallback(() => {
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
      hidePokeVariants: !includeVariantInCreation,
    }

    storeNewPokedex(newPokedexToAdd)
    slidingMenuRef.current?.closeOverlay();
  }, [pokedexNameField, genFilter, storeNewPokedex, includeVariantInCreation])

  const onDeletePokedexPress = useCallback(() => {
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

  return {
    onCreatePokedexPress, onRenamePress, onDeletePokedexPress,
    pokedexNameField, setPokedexNameField,
    genFilter, setGenFilter,
    slidingMenuRef,
    includeVariantInCreation,
    onIncludePokeVariantPress, onExcludePokeVariantPress
  }
}

export default usePokedexCreateEditPanelService