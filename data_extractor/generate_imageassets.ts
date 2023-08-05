import fs from "fs"
import { Pokemon } from "../src/types/Pokemon"
import { getIdFromHref } from "./utils"
import { execSync } from "child_process"

const indentSpaces = 2;

const pokeImagesPath = "./src/assets/pokeimages"
const pokeJSONPath = "./src/assets/pokemon.json"

const targetGenPath = "./src/assets/pokeImages.ts"

if (!fs.existsSync(pokeImagesPath)) {
  throw new Error(`Unable to find ${pokeImagesPath}. Ensure you have executed "npm run datagen" first.`)
}

if (!fs.existsSync(pokeJSONPath)) {
  throw new Error(`Unable to find ${pokeJSONPath}. Ensure you have executed "npm run datagen" first.`)
}

execSync(`powershell.exe -ExecutionPolicy Bypass -File data_extractor/transform_images.ps1`, { stdio: 'inherit' })
process.exit()
if (fs.existsSync(targetGenPath)) {
  throw new Error(`File ${targetGenPath} already exists! Delete it first to execute script again.`)
}




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

const pokeJSON = JSON.parse(fs.readFileSync(pokeJSONPath).toString()) as Pokemon[]

const jsonLine = pokeJSON.map((e) => `${" ".repeat(indentSpaces)}'${e.id}': require('../assets/pokeimages/${getIdFromHref(e.imageUrl)}'),`)

// write the contents
const fullFileContents = fileStart + jsonLine.join("\n") + fileEnd;
fs.writeFileSync(targetGenPath, fullFileContents)