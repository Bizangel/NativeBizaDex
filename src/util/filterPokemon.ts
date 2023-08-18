import { GenerationalDexSteps } from "../common/pokeInfo";
import { PokeType, Pokemon } from "../types/Pokemon";
import { lowercaseAZNormalizeMobile } from "./utils";

function stringSearchMatchSimilar(query: string, pokeName: string) {
  return lowercaseAZNormalizeMobile(pokeName).replaceAll(' ', '').includes(lowercaseAZNormalizeMobile(query).replaceAll(' ', ''))
}

const pokeGenRanges = [-1, ...GenerationalDexSteps]; // -1 as ranges are (a,b]

function isPokeGenIncluded(dexNumber: number, genFilter: boolean[]) {
  for (let i = 0; i < genFilter.length; i++) {
    if (genFilter[i] && (pokeGenRanges[i] < dexNumber) && (dexNumber <= pokeGenRanges[i + 1]))
      return true;
  }

  return false; // not included in any.
}


export function filterPokemon(allPokemon: Pokemon[], filters: PokeFilter): Pokemon[] {
  const genFiltered = allPokemon.filter(poke => isPokeGenIncluded(poke.nationalDexNumber, filters.genFilter))
  const filteredByString = genFiltered.filter(e => stringSearchMatchSimilar(filters.searchString, e.displayName))
  return filteredByString.filter(e => e.type.some(type => filters.typesFilter.includes(type)));
}

export type PokeFilter = {
  searchString: string,
  typesFilter: PokeType[],
  genFilter: boolean[],
}