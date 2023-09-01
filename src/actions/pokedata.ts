import { create } from "zustand";
import { PokeFilter, allPokemon, initialPokefilter } from "../common/pokeInfo";
import { Pokemon } from "../types/Pokemon";
import { produce } from "immer";

interface PokedataStore {
  currentPokeFilter: PokeFilter,
  currentFilteredPokemon: Pokemon[],
  selectedPokemon: Pokemon | null,


  setSelectedPokemon: (x: Pokemon | null) => void,
  setCurrentFilteredPokemon: (x: Pokemon[]) => void,
  setTextSearchPokefilter: (x: string) => void,
  setCurrentPokefilter: (x: PokeFilter) => void,

  clearPokefilter: () => void,
}

export const usePokedataStore = create<PokedataStore>()((set, _get) => ({
  currentPokeFilter: initialPokefilter,
  currentFilteredPokemon: allPokemon,
  selectedPokemon: null,

  setSelectedPokemon: (x) => { set({ selectedPokemon: x }) },
  setCurrentFilteredPokemon: (x) => { set({ currentFilteredPokemon: x }) },

  setTextSearchPokefilter: (x) => {
    set(prev => produce(prev, draft => {
      draft.currentPokeFilter.searchString = x
    }))
  },

  setCurrentPokefilter: (x) => {
    set({ currentPokeFilter: x })
  },

  clearPokefilter: () => { set({ currentPokeFilter: initialPokefilter }) }
}))