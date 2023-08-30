import { create } from "zustand";
import { StoredPokedex } from "../common/pokeInfo";

/**
 * Idea is to use a zustand global store.
 * Every time this store changes, the local storage is automatically updated to reflect that.
 * Additionally on first startup the value on the storage is the default one.
 * Then it checks for stored values. This may trigger an unnecessary rewrite on app startup.
 */

export interface LocalStorageState {
  selectedPokedex: StoredPokedex | null, // null means global pokedex

  allStoredPokedexes: StoredPokedex[],

  sampleState: number | null,
}

export interface LocalStorageFunctions {
  changeSelectedPokedex: (x: StoredPokedex | null) => void,

  changeState: (x: number) => void,
}

export const useZustandStorage = create<LocalStorageState & LocalStorageFunctions>()((set) => ({
  selectedPokedex: null,
  allStoredPokedexes: [],

  sampleState: 0,

  changeSelectedPokedex: (x: StoredPokedex | null) => { set({ selectedPokedex: x }) },

  changeState: (x: number) => { set({ sampleState: x }); }
}))



