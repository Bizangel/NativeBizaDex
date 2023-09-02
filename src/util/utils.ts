import { types2color, types2semiEndColor } from "../styles/styles";
import { PokeType, Pokemon } from "../types/Pokemon";

export type ValueOf<T> = T[keyof T];

export function getPokeimage(poke: Pokemon) {
  const startIndex = poke.imageUrl.lastIndexOf('/') + 1;
  const extractedString = poke.imageUrl.substring(startIndex, poke.imageUrl.length);
  return extractedString;
}

export function lowercaseAZNormalizeMobile(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z ]/g, '')
}

/**
 * Adds an opacity value to a css string and returns a css compatible string
 * @param colorstr A color string of the form of a hexstring or rgb triplet (css compatible)
 * @param opacity Must be between 0 and 1
 * @returns  A css compatible string including the opacity.
 */
export function AddOpacityToColorString(colorstr: string, opacity: number) {
  if (colorstr.startsWith("#")) {
    // hex color
    let opacityInt = Math.ceil(opacity * 255);
    return colorstr + opacityInt.toString(16).padStart(2, '0') // append it
  } else if (colorstr.startsWith("rgb(")) {
    // rgb color
    const tripletNoParenthesis = colorstr.split('(')[1].replace(")", "").trim()
    return `rgba(${tripletNoParenthesis},${opacity})`
  } else {
    throw new Error(`Received:  ${colorstr} in AddOpacityToColorString (rgba values not allowed!, else why are you adding alpha?)`)
  }
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

/** Finds an evolution tree starting nodes. These are the nodes in which are NOT directed by another node. */
export function findEvotreeStartingNodes(evoTree: Pokemon["evoTree"]): string[] {
  const allKeys = Object.keys(evoTree);

  const reached = new Set(Object.values(evoTree).flat().map(e => e.pokeId))
  return allKeys.filter(e => !reached.has(e))
}

export function generateRangesWithPrefix(arr: boolean[], prefix: string) {
  const ranges = [];
  let start = null;

  for (let i = 0; i < arr.length; i++) {
    if (arr[i]) {
      if (start === null) {
        start = i;
      }
    } else if (start !== null) {
      ranges.push([start, i - 1]);
      start = null;
    }
  }

  if (start !== null) {
    ranges.push([start, arr.length - 1]);
  }

  const result = [];
  for (const [st, end] of ranges) {
    if (st === end) {
      result.push(`${prefix} ${st + 1}`);
    } else {
      result.push(`${prefix} ${st + 1}-${end + 1}`);
    }
  }

  return result.join(", ");
}

/** Receives an array, and splits it into an array of subarrays of at most length 3
 * ex: [a,b,c,d,e,f,g,h] => [[a,b,c],[d,e,f], [g,h]]
 */
export function splitIntoThrees<T>(arr: T[]) {
  const splitted: T[][] = [[]]
  arr.forEach((ele) => {
    if (splitted.at(-1)?.length === 3)
      splitted.push([ele])// add to new
    else
      splitted.at(-1)?.push(ele)
  })
  return splitted;
}



export function cycleValues<T>(val: T, allValues: T[]) {
  const currIndex = allValues.findIndex(e => e === val)
  if (currIndex === (allValues.length - 1))
    return allValues[0];

  return allValues[currIndex + 1];
}