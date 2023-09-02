import { filterPokemon } from "../util/filterPokemon";
import { useEffect } from "react"
import { usePokedataStore } from "./pokedata";
import { allPokemon } from "../common/pokeInfo";
import usePersistentActiveDex from "../hooks/usePersistentActiveDex";

const debounceDelay = 200;


export function useDebouncedPokeFilter() {
  const currentPokeFilter = usePokedataStore(e => e.currentPokeFilter)
  const sortCriteria = usePokedataStore(e => e.currentSorting)
  const setCurrentFilteredPokemon = usePokedataStore(e => e.setCurrentFilteredPokemon)
  const activeDexGenFilter = usePersistentActiveDex(e => e.genFilter);
  const caughtPokemon = usePersistentActiveDex(e => e.caughtPokemon);
  const activeDexHidePokevariants = usePersistentActiveDex(e => e.hidePokeVariants);

  // debounce filter for efficiency
  useEffect(() => {
    const timeout = setTimeout(() => {
      const filteredPoke = filterPokemon(allPokemon, currentPokeFilter,
        activeDexHidePokevariants && activeDexGenFilter ? { genFilter: activeDexGenFilter, hideVariants: activeDexHidePokevariants } : null,
        caughtPokemon,
        sortCriteria);
      setCurrentFilteredPokemon(filteredPoke)
    }, debounceDelay);

    return () => {
      clearTimeout(timeout)
    }
  }, [currentPokeFilter, activeDexGenFilter, activeDexHidePokevariants, setCurrentFilteredPokemon, sortCriteria, caughtPokemon])

}