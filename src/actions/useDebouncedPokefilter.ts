import { filterPokemon } from "../util/filterPokemon";
import { useEffect } from "react"
import { usePokedataStore } from "./pokedata";
import { usePersistentStorage } from "../localstore/storage";
import { allPokemon } from "../common/pokeInfo";

const debounceDelay = 200;


export function useDebouncedPokeFilter() {
  const currentPokeFilter = usePokedataStore(e => e.currentPokeFilter)
  const sortCriteria = usePokedataStore(e => e.currentSorting)
  const setCurrentFilteredPokemon = usePokedataStore(e => e.setCurrentFilteredPokemon)
  const activePokedex = usePersistentStorage(e => e.activePokedex)

  // debounce filter for efficiency
  useEffect(() => {
    const timeout = setTimeout(() => {
      const filteredPoke = filterPokemon(allPokemon, currentPokeFilter, activePokedex, sortCriteria);
      setCurrentFilteredPokemon(filteredPoke)
    }, debounceDelay);

    return () => {
      clearTimeout(timeout)
    }
  }, [currentPokeFilter, activePokedex, setCurrentFilteredPokemon, sortCriteria])

}