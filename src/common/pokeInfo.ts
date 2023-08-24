import { Ability, PokeType, Pokemon } from "../types/Pokemon";

// Everything needed to update the project SHOULD be here.
export let allPokemon: Pokemon[] = [];
export let allAbilities: Ability[] = [];

if (process.env.npm_lifecycle_event !== "datagen") {
  allPokemon = require('../assets/pokemon.json') as Pokemon[];
  allAbilities = require('../assets/abilities.json') as Ability[];
}

export const pokeMapping = new Map<string, Pokemon>();
export const abilityMap = new Map<string, Ability>();

allAbilities.forEach((abi) => {
  abilityMap.set(abi.id, abi);
})

allPokemon.forEach((poke) => {
  pokeMapping.set(poke.id, poke);
})

export const PokemonTypes = [
  "Normal", "Fire", "Water", "Electric",
  "Grass", "Ice", "Fighting", "Poison",
  "Ground", "Flying", "Psychic", "Bug",
  "Rock", "Ghost", "Dragon", "Dark",
  "Steel", "Fairy"] as const;

export enum MegaFilter {
  NoMega = "No Mega Evolutions",
  IncludeMegas = "Include Mega Evolutions",
  OnlyMega = "Only Mega Evolutions",
}

export type PokeFilter = {
  searchString: string,
  typesFilter: Record<PokeType, boolean>,
  genFilter: boolean[],
  displayMegas: MegaFilter,

  baseStatThreshold: number | undefined,
  baseStatThresholdOperator: "le" | "ge",
}

export const lastPokegen = 9;
// mew, celebi, deoxys, arceus, genesect, volcanion, melmetal, enamorus, iron leaves
export const GenerationalDexSteps = [151, 251, 386, 493, 649, 721, 809, 905, 1010]; // includes last poke

const initialTypeFilter = Object.fromEntries(PokemonTypes.map(e => [e, true])) as Record<PokeType, boolean>

export const initialPokefilter: PokeFilter = {
  searchString: "", typesFilter: initialTypeFilter, genFilter: Array(lastPokegen).fill(true), displayMegas: MegaFilter.IncludeMegas,
  baseStatThreshold: undefined, baseStatThresholdOperator: "ge",
}
