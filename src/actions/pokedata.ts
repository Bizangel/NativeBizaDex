import { create } from "zustand";
import { PokeFilter, allPokemon, initialPokefilter, initialPokeSort, PokeSorting, PokeSortKey } from "../common/pokeInfo";
import { Pokemon } from "../types/Pokemon";
import { produce } from "immer";

interface PokedataStore {
  currentPokeFilter: PokeFilter,
  currentFilteredPokemon: Pokemon[],
  selectedPokemon: Pokemon | null,
  currentSorting: PokeSorting,

  setSelectedPokemon: (x: Pokemon | null) => void,
  setCurrentFilteredPokemon: (x: Pokemon[]) => void,
  setTextSearchPokefilter: (x: string) => void,
  setCurrentPokefilter: (x: PokeFilter) => void,

  setCurrentSortingKey: (key: PokeSortKey) => void,
  toggleAscendingSorting: () => void,

  resetToDefaultSorting: () => void,
  resetToDefaultFilters: () => void,
}

export const usePokedataStore = create<PokedataStore>()((set, get) => ({
  currentPokeFilter: initialPokefilter,
  currentFilteredPokemon: allPokemon,
  selectedPokemon: null,
  currentSorting: initialPokeSort,

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

  togglePokevariantsFilter: () => {
    set(prev => produce(prev, draft => {
      draft.currentPokeFilter.hideVariants = !get().currentPokeFilter.hideVariants
    }))
  },


  setCurrentSortingKey: (key) => {
    set(prev => produce(prev, draft => {
      draft.currentSorting.sortKey = key;
    }))
  },

  toggleAscendingSorting: () => {
    set(prev => produce(prev, draft => {
      draft.currentSorting.ascending = !prev.currentSorting.ascending;
    }))
  },

  resetToDefaultSorting: () => { set({ currentSorting: initialPokeSort }) },
  resetToDefaultFilters: () => { set({ currentPokeFilter: initialPokefilter }) }
}))