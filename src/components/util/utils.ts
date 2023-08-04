import { Pokemon } from "../../types/Pokemon";

export function getPokeimage(poke: Pokemon) {
  const startIndex = poke.imageUrl.lastIndexOf('/') + 1;
  const extractedString = poke.imageUrl.substring(startIndex, poke.imageUrl.length);
  return extractedString;
}