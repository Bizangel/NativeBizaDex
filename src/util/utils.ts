import { types2color, types2semiEndColor } from "../styles/styles";
import { PokeType, Pokemon } from "../types/Pokemon";

export function getPokeimage(poke: Pokemon) {
  const startIndex = poke.imageUrl.lastIndexOf('/') + 1;
  const extractedString = poke.imageUrl.substring(startIndex, poke.imageUrl.length);
  return extractedString;
}

export function lowercaseAZNormalizeMobile(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z ]/g, '')
}


export const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);

export function interpolateRGB(lambda: number, originRGB: [number, number, number], targetRGB: [number, number, number]) {
  const clamped = clamp(lambda, 0, 1);

  const A = originRGB.map(e => e * (1 - clamped));
  const B = targetRGB.map(e => e * clamped);

  return "rgb(" + [A[0] + B[0], A[1] + B[1], A[2] + B[2]].join(", ") + ")"
}

function parseRGB(rgbString: string): [number, number, number] {
  const rgbValues = rgbString.match(/\d+/g); // Extract numeric values from the string
  if (!rgbValues || rgbValues.length !== 3)
    throw new Error(`Unable to parse RGB Value: ${rgbString} `)

  return rgbValues.map(value => parseInt(value, 10)) as [number, number, number];
}

const colorStops: [number, string][] = [
  [0, "rgb(240, 56, 10)"],
  [60, "rgb(255, 221, 87)"],
  [90, "rgb(160, 229, 21)"],
  [120, "rgb(35, 205, 94)"],
  [150, "rgb(0, 194, 184)"]
];


export function getStatColorBasedOnAmount(statValue: number) {
  for (let i = 1; i < colorStops.length; i++) {
    const [startValue, startColor] = colorStops[i - 1];
    const [endValue, endColor] = colorStops[i];

    if (statValue <= endValue) {
      const lambda = (statValue - startValue) / (endValue - startValue);
      return interpolateRGB(lambda, parseRGB(startColor), parseRGB(endColor));
    }
  }

  return colorStops[colorStops.length - 1][1]; // Default to the last color
}

export function getPokegradientColorFromTypes(types: PokeType[]) {
  let gradientColor = types.map(e => types2color[e]);

  if (gradientColor.length === 1) {
    gradientColor = [gradientColor[0], types2semiEndColor[types[0]]] // repeat 1st color twice.
  }

  return gradientColor;
}