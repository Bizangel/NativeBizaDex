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
  pokemon.sort((a, b) => {
    const valA = sortKeySelector(a);
    const valB = sortKeySelector(b);

    if (valA === valB) // if they're equal in whatever it is, fallback to variantIndex
      return a.variantIndex - b.variantIndex;

    return (valA < valB) ? -1 : 1;
  })
  if (!sortCriteria.ascending)
    pokemon.reverse();

  return pokemon;
}