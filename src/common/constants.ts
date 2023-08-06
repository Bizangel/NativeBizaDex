import { PokeType } from "../types/Pokemon";

export const types2color: Record<PokeType, string> = {
  Normal: "rgb(170,170,153)",
  Fire: "rgb(255,68,34)",
  Water: "rgb(51,153,255)",
  Electric: "rgb(255,204,51)",
  Grass: "rgb(119,204,85)",
  Ice: "rgb(102,204,255)",
  Fighting: "rgb(187,85,68)",
  Poison: "rgb(170,85,153)",
  Ground: "rgb(221,187,85)",
  Flying: "rgb(136,153,255)",
  Psychic: "rgb(255,85,153)",
  Bug: "rgb(170,187,34)",
  Rock: "rgb(187,170,102)",
  Ghost: "rgb(102,102,187)",
  Dragon: "rgb(119,102,238)",
  Dark: "rgb(119,85,68)",
  Steel: "rgb(170,170,187)",
  Fairy: "rgb(238,153,238)"
} as const