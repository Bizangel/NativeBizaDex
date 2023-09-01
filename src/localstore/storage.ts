import { create } from "zustand";
import { StoredPokedex } from "../common/pokeInfo";
import { produce } from "immer";
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LocalStorageState {
  activePokedex: StoredPokedex | null, // null means global pokedex

  allStoredPokedexes: StoredPokedex[],
}

export interface LocalStorageFunctions {
  changeSelectedPokedex: (x: StoredPokedex | null) => void,

  storeNewPokedex: (x: StoredPokedex) => void,
  removeStoredPokedexByID: (id: string) => void,
  renameStoredPokedex: (pokedexId: string, newName: string) => void,
}

export const usePersistentStorage = create<LocalStorageState & LocalStorageFunctions>()(
  persist(
    (set, get) => ({
      activePokedex: null,
      allStoredPokedexes: [],

      sampleState: 0,

      changeSelectedPokedex: (x: StoredPokedex | null) => {
        set({ activePokedex: x })
      },

      storeNewPokedex: (x: StoredPokedex) => {
        set(prev => produce(prev, draft => { draft.allStoredPokedexes.push(x) }))
      },

      removeStoredPokedexByID: (id: string) => {
        if (get().activePokedex?.pokedexId === id) {
          set({ activePokedex: null }); // unselect pokedex if deleting that one.
        }

        set({ allStoredPokedexes: get().allStoredPokedexes.filter(e => e.pokedexId !== id) })
      },

      renameStoredPokedex: (pokedexId: string, newName: string) => {
        set(prev => produce(prev, draft => {
          const found = draft.allStoredPokedexes.find(e => e.pokedexId === pokedexId);
          if (found)
            found.pokedexName = newName;
        }))

        // if renaming that one, also re-select with updated name
        const postUpdate = get();
        if (postUpdate.activePokedex?.pokedexId === pokedexId) {
          set({ activePokedex: postUpdate.allStoredPokedexes.find(e => e.pokedexId === pokedexId) }); // unselect pokedex if deleting that one.
        }
      },
    }),
    {
      name: 'persistant-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)



