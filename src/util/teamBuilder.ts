import { PokemonTypes } from "../common/pokeInfo";
import { PokeType, Pokemon } from "../types/Pokemon";



export function calculateTypeCoverage(pokes: Pokemon[]): Record<PokeType, boolean> {

  const covered = Object.fromEntries(PokemonTypes.map(e => [e, false])) as Record<PokeType, boolean>;

  // TODO add type table.

  return covered;
}