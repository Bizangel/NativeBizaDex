import fs from "fs"
import { Pokemon } from "../src/types/Pokemon"
import { downloadImage } from "./utils";

const pokeJSONPath = "./src/assets/pokemon.json"
const pokeImagesPath = "./src/assets/pokeimages"

if (!fs.existsSync(pokeJSONPath)) {
  throw new Error(`Unable to find ${pokeJSONPath}. Ensure you have executed "npm run datagen" first.`)
}

// create poke image folder if it doesn't exist.
if (!fs.existsSync(pokeImagesPath)) {
  fs.mkdirSync(pokeImagesPath)
}

const baseUrl = "https://assets.pokemon.com/assets/cms2/img/pokedex/full/"

async function handlePokedownloadExceptions(id: string, pokedex_n: number, form_index: number | null, targetPath: string): Promise<boolean> {
  const baseFallback = "https://img.pokemondb.net/artwork/vector/";

  if (pokedex_n === 351) { // castform exceptions
    if (form_index === null) // for normal form, just keep as usual
      return false;

    await downloadImage(baseFallback + id + ".png", targetPath)
    return true;
  }

  if (pokedex_n === 555 && form_index) {
    if (form_index === 3) // galarian
      await downloadImage(baseUrl + pokedex_n.toString().padStart(3, '0') + `_f2` + '.png', targetPath)
    if (form_index === 2) // zen
      await downloadImage('https://archives.bulbagarden.net/media/upload/8/88/0555Darmanitan-Zen.png', targetPath)
    if (form_index === 4) // zen galar
      await downloadImage('https://archives.bulbagarden.net/media/upload/9/97/0555Darmanitan-Galar_Zen.png', targetPath)
    return true;
  }

  if (pokedex_n === 133 && form_index) { // partner evee
    await downloadImage('https://archives.bulbagarden.net/media/upload/5/5c/0133Eevee-Starter.png', targetPath)
    return true;
  }

  if (pokedex_n === 25 && form_index) { // partner pikachu
    await downloadImage('https://archives.bulbagarden.net/media/upload/8/85/0025Pikachu-Starter.png', targetPath)
    return true;
  }

  if (pokedex_n === 744 && form_index) { // rock ruff own temp use same img (notice no _f )
    await downloadImage(baseUrl + pokedex_n.toString().padStart(3, '0') + '.png', targetPath)
    return true;
  }

  if (pokedex_n === 875 && form_index) { // esicue ice form
    await downloadImage("https://archives.bulbagarden.net/media/upload/f/fc/0875Eiscue-Noice.png", targetPath)
    return true;
  }

  return false;
}

async function downloadPokeImage(id: string, pokedex_n: number, form_index: number | null) {
  const targetPath = "./src/assets/pokeimages/" + id + ".png"
  if (fs.existsSync(targetPath))
    return;

  if (await handlePokedownloadExceptions(id, pokedex_n, form_index, targetPath))
    return;

  if (form_index === null) {
    const toFetch = baseUrl + pokedex_n.toString().padStart(3, '0') + '.png'
    await downloadImage(toFetch, targetPath)
    return;
  }

  const toFetch = baseUrl + pokedex_n.toString().padStart(3, '0') + `_f${form_index}` + '.png'
  await downloadImage(toFetch, targetPath)
  return;
}


const pokeJSON = JSON.parse(fs.readFileSync("./src/assets/pokemon.json").toString()) as Pokemon[];


let lastPokedexNumber = -1;
let lastFormNumber = 1;

pokeJSON.forEach(poke => {
  if (poke.nationalDexNumber === lastPokedexNumber) {
    // means it's a variant form
    lastFormNumber++;
    downloadPokeImage(poke.id, poke.nationalDexNumber, lastFormNumber)
  } else {
    // just fetch first one, no specific form
    downloadPokeImage(poke.id, poke.nationalDexNumber, null)
    lastFormNumber = 1;
  }

  lastPokedexNumber = poke.nationalDexNumber;
})

// validate that all exists
pokeJSON.forEach((e) => {
  if (fs.existsSync(pokeImagesPath + e.id + ".png"))
    throw new Error(`Missing image for: ${e.id} ${e.displayName}`)
})

/**
 * TS FILE GENERATION with images
 * ============================
 */

const indentSpaces = 2;
const targetGenPath = "./src/assets/pokeImages.ts"
const fileStart = `
import { ImageSourcePropType } from "react-native";

/* =====================================================
 * This file was automatically generated using
 * "npm run datagen"
 * See ./data_extractor/generate_imageassets.ts and README for more info.
 * =====================================================
 */

const pokeImages: Record<string, ImageSourcePropType> = {
`

const fileEnd = `}\n\nexport default pokeImages;`

const jsonLine = pokeJSON.map((e) => `${" ".repeat(indentSpaces)}'${e.id}': require('../assets/pokeimages/${e.id}.png'),`)

// write the contents
const fullFileContents = fileStart + jsonLine.join("\n") + fileEnd;
fs.writeFileSync(targetGenPath, fullFileContents)