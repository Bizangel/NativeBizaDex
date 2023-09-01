import { PokeSortKey, PokeSorting } from "../common/pokeInfo";
import { Pokemon } from "../types/Pokemon";
import { lowercaseAZNormalizeMobile } from "./utils";


const sortkey2pokekey: Record<PokeSortKey, (poke: Pokemon) => string | number> = {
  [PokeSortKey.DEX]: (poke) => poke.nationalDexNumber,
  [PokeSortKey.ALPHABETICALLY]: (poke) => lowercaseAZNormalizeMobile(poke.displayName),
  [PokeSortKey.STAT_TOTAL]: (poke) => poke.baseStatTotal,
}

export function sortPokemon(pokemon: Pokemon[], sortCriteria: PokeSorting): Pokemon[] {
  const sortKeySelector = sortkey2pokekey[sortCriteria.sortKey];
  pokemon.sort((a, b) => (sortCriteria.ascending ? 1 : -1) * (sortKeySelector(a) < sortKeySelector(b) ? -1 : 1))
  return pokemon;
}