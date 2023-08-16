import { Ability, Pokemon } from "../types/Pokemon";

export const allPokemon = require('../assets/pokemon.json') as Pokemon[];

const allAbilities = require('../assets/abilities.json') as Ability[];
export const abilityMap = new Map<string, Ability>();

allAbilities.forEach((abi) => {
  abilityMap.set(abi.id, abi);
})
