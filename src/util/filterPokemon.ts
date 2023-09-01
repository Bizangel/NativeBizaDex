import { GenerationalDexSteps, MegaFilter, PokeFilter, PokeSorting, StoredPokedex } from "../common/pokeInfo";
import { Pokemon } from "../types/Pokemon";
import { sortPokemon } from "./sortPokemon";
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


export function filterPokemon(allPokemon: Pokemon[], filters: PokeFilter,
  activeDexFilters: { genFilter: StoredPokedex["genFilter"], hideVariants: StoredPokedex["hidePokeVariants"] } | null,
  sortCriteria: PokeSorting): Pokemon[] {

  const genFilter = activeDexFilters ? activeDexFilters.genFilter : filters.genFilter; // use gen filter from pokedex if it is specified
  const hideVariants = filters.hideVariants || activeDexFilters?.hideVariants === true;

  const genFiltered = allPokemon.filter(poke => isPokeGenIncluded(poke.nationalDexNumber, genFilter))
  const filteredByString = genFiltered.filter(e => stringSearchMatchSimilar(filters.searchString, e.displayName))
  const filteredByType = filteredByString.filter(e => e.type.some(type => filters.typesFilter[type]));

  // filter megas
  let filteredMegas = filteredByType;
  if (filters.displayMegas === MegaFilter.NoMega) {
    filteredMegas = filteredMegas.filter(e => !e.isMega);
  }
  if (filters.displayMegas === MegaFilter.OnlyMega) {
    filteredMegas = filteredMegas.filter(e => e.isMega);
  }

  let filteredByThreshold = filteredMegas;
  if (filters.baseStatThreshold !== undefined) {
    if (filters.baseStatThresholdOperator === "ge") {
      filteredByThreshold = filteredByThreshold.filter(e => e.baseStatTotal >= (filters.baseStatThreshold ?? 0))
    } else {
      filteredByThreshold = filteredByThreshold.filter(e => e.baseStatTotal <= (filters.baseStatThreshold ?? 0))
    }
  }

  const filteredByVariants = hideVariants ? filteredByThreshold.filter(e => e.variantIndex === 0) : filteredByThreshold

  return sortPokemon(filteredByVariants, sortCriteria);
}

