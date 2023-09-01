import { create } from "zustand";
import { StoredPokedex } from "../common/pokeInfo";
import { produce } from "immer";
import { persist, createJSONStorage } from "zustand/middleware"
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface LocalStorageState {
  activePokedexIndex: number | null, // null means global pokedex

  allStoredPokedexes: StoredPokedex[],
}

export interface LocalStorageFunctions {
  changeSelectedPokedexIndex: (x: number | null) => void,

  storeNewPokedex: (x: StoredPokedex) => void,
  removeStoredPokedexByID: (id: string) => void,
  renameStoredPokedex: (pokedexId: string, newName: string) => void,

  togglePokemonCaptured: (pokemonId: string) => void,
}

export const usePersistentStorage = create<LocalStorageState & LocalStorageFunctions>()(
  persist(
    (set, get) => ({
      activePokedexIndex: null,
      allStoredPokedexes: [],

      changeSelectedPokedexIndex: (newIndex: number | null) => {
        set({ activePokedexIndex: newIndex })
      },

      storeNewPokedex: (x: StoredPokedex) => {
        set(prev => produce(prev, draft => { draft.allStoredPokedexes.push(x) }))
      },

      removeStoredPokedexByID: (id: string) => {
        const storedDexes = get().allStoredPokedexes;
        const indexToRemove = storedDexes.findIndex(e => e.pokedexId === id);

        if (indexToRemove === get().activePokedexIndex) {
          set({ activePokedexIndex: null }); // unselect pokedex if deleting active one
        }

        set({ allStoredPokedexes: get().allStoredPokedexes.filter(e => e.pokedexId !== id) })
      },

      renameStoredPokedex: (pokedexId: string, newName: string) => {
        set(prev => produce(prev, draft => {
          const found = draft.allStoredPokedexes.find(e => e.pokedexId === pokedexId);
          if (found)
            found.pokedexName = newName;
        }))
      },

      togglePokemonCaptured: (pokemonId: string) => {
        set(prev => produce(prev, draft => {
          const activePokedexIndex = prev.activePokedexIndex
          if (activePokedexIndex !== null) {
            const activeDex = prev.allStoredPokedexes[activePokedexIndex];
            if (pokemonId in activeDex.caughtPokemon) {
              delete draft.allStoredPokedexes[activePokedexIndex].caughtPokemon[pokemonId];
            } else {
              draft.allStoredPokedexes[activePokedexIndex].caughtPokemon[pokemonId] = true;
            }
          }
        }))
      },

    }),
    {
      name: 'persistant-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)



