import { create } from "zustand";
import { StoredPokedex } from "../common/pokeInfo";
import { produce } from "immer";

/**
 * Idea is to use a zustand global store.
 * Every time this store changes, the local storage is automatically updated to reflect that.
 * Additionally on first startup the value on the storage is the default one.
 * Then it checks for stored values. This may trigger an unnecessary rewrite on app startup.
 */

export interface LocalStorageState {
  selectedPokedex: StoredPokedex | null, // null means global pokedex

  allStoredPokedexes: StoredPokedex[],
}

export interface LocalStorageFunctions {
  changeSelectedPokedex: (x: StoredPokedex | null) => void,

  storeNewPokedex: (x: StoredPokedex) => void,
  removeStoredPokedexByID: (id: string) => void,
}

export const useZustandStorage = create<LocalStorageState & LocalStorageFunctions>()((set, get) => ({
  selectedPokedex: null,
  allStoredPokedexes: [],

  sampleState: 0,

  changeSelectedPokedex: (x: StoredPokedex | null) => { set({ selectedPokedex: x }) },

  storeNewPokedex: (x: StoredPokedex) => {
    set(prev => produce(prev, draft => { draft.allStoredPokedexes.push(x) }))
  },

  removeStoredPokedexByID: (id: string) => {
    set({ allStoredPokedexes: get().allStoredPokedexes.filter(e => e.pokedexId !== id) })
  }
}))



