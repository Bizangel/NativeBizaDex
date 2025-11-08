import fs from "fs"
import { Pokemon } from "../src/types/Pokemon"
import { downloadImage, withProgressBarTick } from "./utils";
import CliProgress from "cli-progress"

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
    await downloadImage('https://archives.bulbagarden.net/media/upload/8/84/0133Eevee-Partner.png', targetPath)
    return true;
  }

  if (pokedex_n === 25 && form_index) { // partner pikachu
    await downloadImage('https://archives.bulbagarden.net/media/upload/b/b4/0025Pikachu-Partner.png', targetPath)
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

  if (pokedex_n === 36 && form_index) { // mega clefable
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/3/3f/Spr_9z_0036M.png/1024px-Spr_9z_0036M.png", targetPath)
    return true;
  }

  if (pokedex_n === 71 && form_index) { // mega victreebel
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/f/f8/0071Victreebel-Mega_ZA.png/1024px-0071Victreebel-Mega_ZA.png", targetPath)
    return true;
  }

  if (pokedex_n === 121 && form_index) { // mega starmie
    await downloadImage("https://archives.bulbagarden.net/media/upload/3/37/Spr_9z_0121M.png", targetPath)
    return true;
  }

  if (pokedex_n === 149 && form_index) { // mega dragonite
    await downloadImage("https://archives.bulbagarden.net/media/upload/3/3e/0149Dragonite-Mega.png", targetPath)
    return true;
  }

  if (pokedex_n === 154 && form_index) { // mega meganium
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/3/3c/0154Meganium-Mega_ZA.png/1024px-0154Meganium-Mega_ZA.png", targetPath)
    return true;
  }

  if (pokedex_n === 160 && form_index) { // feraligatr mega
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/1/14/0160Feraligatr-Mega_ZA.png/1024px-0160Feraligatr-Mega_ZA.png", targetPath)
    return true;
  }

  if (pokedex_n === 227 && form_index) { // mega skarmory
    await downloadImage("https://bulbapedia.bulbagarden.net/wiki/File:Spr_9z_0227M.png", targetPath)
    return true;
  }

  if (pokedex_n === 478 && form_index) { // mega frosslass
    await downloadImage("https://archives.bulbagarden.net/media/upload/5/5b/Spr_9z_0478M.png", targetPath)
    return true;
  }

  if (pokedex_n === 500 && form_index) { // mega emboar
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/a/a6/0500Emboar-Mega_ZA.png/1024px-0500Emboar-Mega_ZA.png", targetPath)
    return true;
  }

  if (pokedex_n === 530 && form_index) { // mega excadrill
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/e/e6/Spr_9z_0530M.png/1024px-Spr_9z_0530M.png", targetPath)
    return true;
  }

  if (pokedex_n === 545 && form_index) { // mega scolipede
    await downloadImage("https://archives.bulbagarden.net/media/upload/f/fc/Spr_9z_0545M.png", targetPath)
    return true;
  }

  if (pokedex_n === 560 && form_index) { // mega scrafty
    await downloadImage("https://archives.bulbagarden.net/media/upload/0/09/Spr_9z_0560M.png", targetPath)
    return true;
  }

  if (pokedex_n === 604 && form_index) { // mega eelektross
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/a/a6/0604Eelektross-Mega_ZA.png/1024px-0604Eelektross-Mega_ZA.png", targetPath)
    return true;
  }

  if (pokedex_n === 609 && form_index) { // mega chandelure
    await downloadImage("https://archives.bulbagarden.net/media/upload/b/bf/Spr_9z_0609M.png", targetPath)
    return true;
  }

  if (pokedex_n === 652 && form_index) { // mega chesnaught
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/b/b2/0652Chesnaught-Mega_ZA.png/1024px-0652Chesnaught-Mega_ZA.png", targetPath)
    return true;
  }

  if (pokedex_n === 655 && form_index) { // mega delphox
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/3/30/0655Delphox-Mega_ZA.png/1024px-0655Delphox-Mega_ZA.png", targetPath)
    return true;
  }

  if (pokedex_n === 658 && form_index) { // mega greninja
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/6/6c/0658Greninja-Mega_ZA.png/1024px-0658Greninja-Mega_ZA.png", targetPath)
    return true;
  }

  if (pokedex_n === 670 && form_index) { // mega floette
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/1/11/Spr_9z_0670M.png/1024px-Spr_9z_0670M.png", targetPath)
    return true;
  }

  if (pokedex_n === 687 && form_index) { // mega malamar
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/3/3a/0687Malamar-Mega_ZA.png/1024px-0687Malamar-Mega_ZA.png", targetPath)
    return true;
  }

  if (pokedex_n === 689 && form_index) { // mega barbaracle
    await downloadImage("https://archives.bulbagarden.net/media/upload/1/14/Spr_9z_0689M.png", targetPath)
    return true;
  }

  if (pokedex_n === 691 && form_index) { // mega dragalge
    await downloadImage("https://archives.bulbagarden.net/media/upload/2/2a/Spr_9z_0691M.png", targetPath)
    return true;
  }

  if (pokedex_n === 691 && form_index) { // mega dragalge
    await downloadImage("https://archives.bulbagarden.net/media/upload/2/2a/Spr_9z_0691M.png", targetPath)
    return true;
  }

  if (pokedex_n === 701 && form_index) { // mega hawlucha
    await downloadImage("https://archives.bulbagarden.net/media/upload/thumb/6/60/0701Hawlucha-Mega_ZA.png/1024px-0701Hawlucha-Mega_ZA.png", targetPath)
    return true;
  }

  if (pokedex_n === 718 && form_index) { // mega zygarde
    await downloadImage("https://archives.bulbagarden.net/media/upload/a/a9/Spr_9z_0718M.png", targetPath)
    return true;
  }

  if (pokedex_n === 780 && form_index) { // mega drampa
    await downloadImage("https://archives.bulbagarden.net/media/upload/0/05/Spr_9z_0780M.png", targetPath)
    return true;
  }

  if (pokedex_n === 870 && form_index) { // mega falinks
    await downloadImage("https://archives.bulbagarden.net/media/upload/d/dc/Spr_9z_0870M.png", targetPath)
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

const pokeInfoPrev: [string, number, number | null][] = pokeJSON.map(poke => {
  if (poke.nationalDexNumber === lastPokedexNumber) {
    // means it's a variant form
    lastFormNumber++;
    return [poke.id, poke.nationalDexNumber, lastFormNumber]
  } else {
    // just fetch first one, no specific form
    lastFormNumber = 1;
    lastPokedexNumber = poke.nationalDexNumber;
    return [poke.id, poke.nationalDexNumber, null]
  }
})


async function MainFunc() {

  const pokeBarProgress = new CliProgress.SingleBar({
    clearOnComplete: false,
    hideCursor: true,
    format: 'Downloading PokeImages {bar} | {value}/{total} Pokemon | Elapsed: {duration_formatted} | Eta: {eta_formatted}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  });

  const downloadPokeImageWithTick = withProgressBarTick(downloadPokeImage, pokeBarProgress);

  pokeBarProgress.start(pokeInfoPrev.length, 0)
  await Promise.all(pokeInfoPrev.map(async ([pokeId, dexNumber, formIndex]) => {
    await downloadPokeImageWithTick(pokeId, dexNumber, formIndex)
  }))

  pokeBarProgress.stop();

  // validate that all exists
  pokeJSON.forEach((e) => {
    if (!fs.existsSync(pokeImagesPath + '/' + e.id + ".png"))
      throw new Error(`Missing image for: ${e.id} ${e.displayName}`)
  })

  console.log("All images downloaded and validated successfully.")
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
 * "npm run imagegen"
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
}

MainFunc()
