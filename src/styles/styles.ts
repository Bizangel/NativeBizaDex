import { StyleSheet } from "react-native";


export const textStyle = StyleSheet.create({
  default: {
    color: "black",
  }
})

export const colorPalette = {
  backgroundBlack: "#212e33",
  backgroundBlack70: "rgba(33, 46, 51, .7)",

  textWhite: "#ffffff",
  textGray: "#dddddd",

  white70: "rgba(0,0,0,7)",

  foregroundButtonBlackInactive: "rgba(155, 175, 182, 0.2)",
  // foregroundButtonBlackInactive: "rgba(34, 136, 170, 0.7)",
  foregroundButtonBlackActive: "rgba(155, 175, 182, 0.7)",
  foregroundButtonBlackFull: "rgb(155, 175, 182)",

  buttonBorderColor: "#43d9df",

  notSoBrightRed: "#d12626",


  notVeryEffectiveRed: "#cc1313",
  superEffectiveGreen: "#25680a"
} as const

import { PokeType } from "../types/Pokemon";
import { TypeEffectiveness } from "../common/pokeInfo";

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

export const types2semiEndColor: Record<PokeType, string> = {
  Normal: "rgb(194, 194, 188)",
  Fire: "rgb(245, 118, 95)",
  Water: "rgb(123, 181, 240)",
  Electric: "rgb(243, 231, 121)",
  Grass: "rgb(149, 235, 115)",
  Ice: "rgb(156, 215, 245)",
  Fighting: "rgb(219, 124, 107)",
  Poison: "rgb(218, 122, 198)",
  Ground: "rgb(238, 208, 119)",
  Flying: "rgb(156, 169, 245)",
  Psychic: "rgb(250, 130, 178)",
  Bug: "rgb(195, 211, 72)",
  Rock: "rgb(228, 209, 133)",
  Ghost: "rgb(140, 140, 223)",
  Dragon: "rgb(151, 137, 245)",
  Dark: "rgb(170, 120, 95)",
  Steel: "rgb(203, 203, 223)",
  Fairy: "rgb(238, 177, 238)"
} as const

export const effectiveness2color: Record<TypeEffectiveness, string> = {
  "0": "black",
  "1/4": colorPalette.notVeryEffectiveRed,
  "1/2": colorPalette.notVeryEffectiveRed,
  "2": colorPalette.superEffectiveGreen,
  "4": colorPalette.superEffectiveGreen,
  "1": colorPalette.backgroundBlack,
}