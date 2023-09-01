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


const TypeChartRaw = `
          NOR FIR WAT ELE GRA ICE FIG POI GRO FLY PSY BUG ROC GHO DRA DAR STE FAI
  Normal   1   1   1   1   1   1   1   1   1   1   1   1   h   0   1   1   h   1
  Fire     1   h   h   1   2   2   1   1   1   1   1   2   h   1   h   1   2   1
  Water    1   2   h   1   h   1   1   1   2   1   1   1   2   1   h   1   1   1
  Electric 1   1   2   h   h   1   1   1   0   2   1   1   1   1   h   1   1   1
  Grass    1   h   2   1   h   1   1   h   2   h   1   h   2   1   h   1   h   1
  Ice      1   h   h   1   2   h   1   1   2   2   1   1   1   1   2   1   h   1
  Fighting 2   1   1   1   1   2   1   h   1   h   h   h   2   0   1   2   2   h
  Poison   1   1   1   1   2   1   1   h   h   1   1   1   h   h   1   1   0   2
  Ground   1   2   1   2   h   1   1   2   1   0   1   h   2   1   1   1   2   1
  Flying   1   1   1   h   2   1   2   1   1   1   1   2   h   1   1   1   h   1
  Psychic  1   1   1   1   1   1   2   2   1   1   h   1   1   1   1   0   h   1
  Bug      1   h   1   1   2   1   h   h   1   h   2   1   1   h   1   2   h   h
  Rock     1   2   1   1   1   2   h   1   h   2   1   2   1   1   1   1   h   1
  Ghost    0   1   1   1   1   1   1   1   1   1   2   1   1   2   1   h   1   1
  Dragon   1   1   1   1   1   1   1   1   1   1   1   1   1   1   2   1   h   0
  Dark     1   1   1   1   1   1   h   1   1   1   2   1   1   2   1   h   1   h
  Steel    1   h   h   h   1   2   1   1   1   1   1   1   2   1   1   1   h   2
  Fairy    1   h   1   1   1   1   2   h   1   1   1   1   1   1   2   2   h   1
`

const TypeChartLines = TypeChartRaw.split('\n').filter(e => e.length > 0).slice(1)
export const TypeChart = TypeChartLines.map(e => e.split(" ").filter(i => i.length > 0).slice(1).map(k => k === "h" ? "1/2" : k)) as TypeEffectiveness[][]

export type TypeEffectiveness = "1/2" | "1" | "2" | "0" | "1/4" | "4"

export enum MegaFilter {
  NoMega = "No Mega Evolutions",
  IncludeMegas = "Showing Mega Evolutions",
  OnlyMega = "Only Mega Evolutions",
}

export type PokeFilter = {
  searchString: string,
  typesFilter: Record<PokeType, boolean>,
  genFilter: boolean[],
  displayMegas: MegaFilter,
  hideVariants: boolean,

  baseStatThreshold: number | undefined,
  baseStatThresholdOperator: "le" | "ge",
}


export enum PokeSortKey {
  DEX = "Dex Number",
  ALPHABETICALLY = "Name Alphabetically",
  STAT_TOTAL = "Stat Total",

  HP_STAT = "Health Stat",
  ATK_STAT = "Attack Stat",
  DEF_STAT = "Defense Stat",
  SPA_STAT = "Special Attack Stat",
  SPD_STAT = "Special Defense Stat",
  SPE_STAT = "Speed Stat",
}

export type PokeSorting = {
  ascending: boolean,
  sortKey: PokeSortKey
}

export type StoredPokedex = {
  pokedexId: string,
  pokedexName: string,
  genFilter: PokeFilter["genFilter"],
  caughtPokemon: Record<number, true>,
}


export const lastPokegen = 9;
// mew, celebi, deoxys, arceus, genesect, volcanion, melmetal, enamorus, iron leaves
export const GenerationalDexSteps = [151, 251, 386, 493, 649, 721, 809, 905, 1010]; // includes last poke

const initialTypeFilter = Object.fromEntries(PokemonTypes.map(e => [e, true])) as Record<PokeType, boolean>

export const initialPokefilter: PokeFilter = {
  searchString: "", typesFilter: initialTypeFilter, genFilter: Array(lastPokegen).fill(true), displayMegas: MegaFilter.IncludeMegas,
  baseStatThreshold: undefined, baseStatThresholdOperator: "ge", hideVariants: false,
}

export const initialPokeSort: PokeSorting = {
  ascending: true,
  sortKey: PokeSortKey.DEX
}

