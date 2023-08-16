import { PokeType, Pokemon } from "../types/Pokemon";
import { lowercaseAZNormalizeMobile } from "./utils";

function stringSearchMatchSimilar(query: string, pokeName: string) {
  return lowercaseAZNormalizeMobile(pokeName).replaceAll(' ', '').includes(lowercaseAZNormalizeMobile(query).replaceAll(' ', ''))
}

export function filterPokemon(allPokemon: Pokemon[], filters: PokeFilter): Pokemon[] {
  const filteredByString = allPokemon.filter(e => stringSearchMatchSimilar(filters.searchString, e.displayName))

  return filteredByString.filter(e => e.type.some(type => filters.typesFilter.includes(type)));
}

export type PokeFilter = {
  searchString: string,
  typesFilter: PokeType[],
}