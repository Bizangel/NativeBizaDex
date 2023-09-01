import { useEffect } from "react"
import { usePokedataStore } from "./pokedata";
import { pokeMapping } from "../common/pokeInfo";


function useDisplayPreselectedPoke(preSelectedPokeId: string | null, onDisplayCallback: () => void) {
  const setSelectedPokemon = usePokedataStore(e => e.setSelectedPokemon);

  useEffect(() => {
    if (!preSelectedPokeId)
      return;

    setSelectedPokemon(null);
    const foundPoke = pokeMapping.get(preSelectedPokeId)
    if (!foundPoke)
      return;

    setSelectedPokemon(foundPoke)
    onDisplayCallback();
  }, [preSelectedPokeId, onDisplayCallback, setSelectedPokemon])
}

export default useDisplayPreselectedPoke;
