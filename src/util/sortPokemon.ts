import { PokeSortKey, PokeSorting } from "../common/pokeInfo";
import { BaseStatName, Pokemon } from "../types/Pokemon";
import { lowercaseAZNormalizeMobile } from "./utils";

const getStatVal = (stat: BaseStatName) => {
  return (poke: Pokemon) => poke.baseStats.find(e => e.statName === stat)?.statValue ?? 0
}

const sortkey2pokekey: Record<PokeSortKey, (poke: Pokemon) => string | number> = {
  [PokeSortKey.DEX]: (poke) => poke.nationalDexNumber,
  [PokeSortKey.ALPHABETICALLY]: (poke) => lowercaseAZNormalizeMobile(poke.displayName),
  [PokeSortKey.STAT_TOTAL]: (poke) => poke.baseStatTotal,

  [PokeSortKey.HP_STAT]: getStatVal("hp"),
  [PokeSortKey.ATK_STAT]: getStatVal("atk"),
  [PokeSortKey.DEF_STAT]: getStatVal("def"),
  [PokeSortKey.SPA_STAT]: getStatVal("spa"),
  [PokeSortKey.SPD_STAT]: getStatVal("spd"),
  [PokeSortKey.SPE_STAT]: getStatVal("spe"),
}

export function sortPokemon(pokemon: Pokemon[], sortCriteria: PokeSorting): Pokemon[] {
  const sortKeySelector = sortkey2pokekey[sortCriteria.sortKey];
  pokemon.sort((a, b) => (sortCriteria.ascending ? 1 : -1) * (sortKeySelector(a) < sortKeySelector(b) ? -1 : 1))
  return pokemon;
}