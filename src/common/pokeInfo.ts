import { Ability, Pokemon } from "../types/Pokemon";

// Everything needed to update the project SHOULD be here.

export const allPokemon = require('../assets/pokemon.json') as Pokemon[];

const allAbilities = require('../assets/abilities.json') as Ability[];
export const abilityMap = new Map<string, Ability>();

allAbilities.forEach((abi) => {
  abilityMap.set(abi.id, abi);
})

export const PokemonTypes = [
  "Normal", "Fire", "Water", "Electric",
  "Grass", "Ice", "Fighting", "Poison",
  "Ground", "Flying", "Psychic", "Bug",
  "Rock", "Ghost", "Dragon", "Dark",
  "Steel", "Fairy"] as const;

export const lastPokegen = 9;
// mew, celebi, deoxys, arceus, genesect, volcanion, melmetal, enamorus, iron leaves
export const GenerationalDexSteps = [151, 251, 386, 493, 649, 721, 809, 905, 1010]; // includes last poke

