import axios from 'axios';
import { load as cheerioLoad } from 'cheerio';
import { downloadImage, getIdFromHref, getPokeIdFromImageUrl, parseEvolveTree } from './utils';
import { Ability, AbilitySchema, BaseStat, BaseStatName, PokeType, Pokemon, PokemonSchema } from '../src/types/Pokemon';
import fs from "fs";

const baseDatabaseUrl = "https://pokemondb.net"

async function getDexMappingToURL(): Promise<Map<number, string>> {
  const response = await axios.get(`${baseDatabaseUrl}/pokedex/all`)
  if (response.status !== 200)
    throw Error("Unable to get index of all pokemon.")
  const $ = cheerioLoad(response.data);

  const rows = $('#pokedex tbody tr')

  let dexMapping = new Map<number, string>();

  rows.each((idx, row) => {
    const anchor = $(row).find('a.ent-name');
    // Get the href value of the anchor element
    const hrefValue = anchor.attr('href');

    // get pokedex number
    const cellNum = parseInt($(row).find('.infocard-cell-data').text().trim(), 10);
    if (hrefValue)
      dexMapping.set(cellNum, hrefValue);
  })

  return dexMapping;
}

type TabInfo = {
  displayName: string,
  tabId: string,
  dexEntry: string,
  generationalChanges: string[],
  evoTree: Record<string, { evolveReason: string, pokeId: string }[]>
}

async function getPokevariantsTabs(html: any): Promise<TabInfo[]> {
  const $ = cheerioLoad(html);

  const res = $('.tabset-basics.sv-tabs-wrapper .sv-tabs-tab-list').first()
  if (res.length === 0)
    throw new Error(`Unable to find pokevariants`)

  let result: TabInfo[] = []

  const entriesTables = $('#dex-flavor').first().nextAll('.resp-scroll').first()

  const pokedexEntry = entriesTables.find('.vitals-table tbody tr').last()
    .find('.cell-med-text').text().trim();

  const mainpageFullName = $('main h1').first().text().trim();

  const possibleChanges = $(`h2:contains("${mainpageFullName} changes")`).first();
  const generationalChanges: string[] = [];

  if (possibleChanges.length > 0) {
    possibleChanges.next().find('li').each((idx, ele) => {
      generationalChanges.push($(ele).text().trim())
    })
  }

  const evoTree = parseEvolveTree(html);

  res.find('.sv-tabs-tab').each((e, ele) => {
    const id = $(ele).attr('href');
    const displayName = $(ele).text().trim()

    if (id) {// remove id hash at start
      result.push({
        displayName: displayName, tabId: id.replace(/^#/, ''),
        dexEntry: pokedexEntry,
        generationalChanges: generationalChanges,
        evoTree: evoTree
      });
    }
  })


  return result;
}


function parsePokeTab(html: any,
  tabInfo: TabInfo): Pokemon {
  const $ = cheerioLoad(html);

  const tab = $(`#${tabInfo.tabId}`).first();


  // get image
  // const imageSrc = $(tab.find('a[rel=lightbox]')).attr('href')
  const imageSrc = tab.find('img').first().attr('src')
  if (!imageSrc)
    throw new Error("Unable to parse html, could not find image href")

  // get ID from image
  const pokeId = getPokeIdFromImageUrl(imageSrc)

  // Get base stats and total
  const pokeBaseStats: BaseStat[] = []
  let baseStatTotal = 0;

  const DexStatsWrapper = tab.find('#dex-stats').parent();
  const statOrder: BaseStatName[] = ["hp", "atk", "def", "spa", "spd", "spe"]

  DexStatsWrapper.find('tbody tr').each((idx, ele) => {
    const value = parseInt($(ele).find('.cell-num').first().text().trim(), 10)
    const stat = statOrder[idx];

    pokeBaseStats.push({ statName: stat, statValue: value })
    baseStatTotal += value;
  })

  // get types
  const pokeTypes: PokeType[] = [];

  const typesWrapper = tab.find('.type-icon').first().parent()
  typesWrapper.find('.type-icon').each((idx, ele) => {
    const type = $(ele).text().trim();
    pokeTypes.push(type as PokeType);
  })

  // get pokedex data

  let dexNumber = -1;
  let pokeSpecies = "";
  let hiddenAbility: string | undefined;

  const abilities_id: string[] = []

  const pokedexDataTable = tab.find('.vitals-table').first();
  pokedexDataTable.find('tr th').each((idx, ele) => {
    const rowText = $(ele).text().trim()
    if (rowText === "National №") {
      dexNumber = parseInt($(ele).parent().find('td').first().text().trim(), 10);
    }

    if (rowText === "Species") {
      pokeSpecies = $(ele).parent().find('td').first().text().trim()
    }

    if (rowText === "Abilities") {
      $(ele).parent().find('td span a').each((_, ele2) => {
        const href = $(ele2).attr('href')?.trim()
        if (href)
          abilities_id.push(getIdFromHref(href))
      })

      // check for hidden ability
      const possHidden = $(ele).parent().find('td small a').first().attr('href');
      if (possHidden)
        hiddenAbility = getIdFromHref(possHidden)
    }
  })

  const isMega = pokeId.endsWith('mega') || pokeId.includes('-mega-'); // works for charizard x / y


  const returnPoke: Pokemon = {
    id: pokeId,
    displayName: tabInfo.displayName,
    species: pokeSpecies,

    baseStats: pokeBaseStats,
    baseStatTotal: baseStatTotal,

    type: pokeTypes,

    imageUrl: imageSrc,

    nationalDexNumber: dexNumber,
    pokedexEntryDescription: tabInfo.dexEntry,

    abilitiesId: abilities_id,
    hiddenAbility: hiddenAbility,

    isMega: isMega,
    generationalChanges: tabInfo.generationalChanges,

    evoTree: tabInfo.evoTree
  }

  // validate it
  const validated = PokemonSchema.parse(returnPoke);
  return validated
}


async function getPokemonFromUrl(url: string): Promise<Pokemon[]> {
  try {
    const response = await axios.get(`${baseDatabaseUrl}${url}`);
    if (response.status !== 200)
      throw new Error(`Could not fetch data for ${url}`)

    const html = response.data;

    const tabsPoke = await getPokevariantsTabs(html);
    const poke = tabsPoke.map(e => parsePokeTab(html, e))

    return poke;
  }
  catch (err: any) {
    console.log(`Error fetching: ${url} error ${err}`)
    return [];
  }
}

// async function fetchAllPokes() {
//   const dexMapping = await getDexMappingToURL()

//   const allhrefs = Array.from(dexMapping.values())
//   const pokeResult = await Promise.all(
//     allhrefs.map(e => getPokemonFromUrl(e))
//   )

//   fs.writeFileSync('./src/assets/pokemon.json', JSON.stringify(pokeResult.flat()))
// }

async function fetchAndParseAbility(abilityId: string): Promise<Ability> {
  try {
    const resp = await axios.get(`${baseDatabaseUrl}/ability/${abilityId}`)
    const html = resp.data;

    const $ = cheerioLoad(html);

    const h1title = $('main h1').first()
    const abilityDisplayName = h1title.contents().filter((index, node) => node.nodeType === 3).text().trim();

    // get effect description
    const effectH2 = $(`h2:contains("Effect")`).first();
    const effectDescription = effectH2.nextUntil('h2').text().trim();

    // get game description
    const entriesTables = $(`h2:contains("Game descriptions")`).first().nextAll('.resp-scroll').first()
    const gameEntry = entriesTables.find('.vitals-table tbody tr').last().find('.cell-med-text').text().trim()

    return {
      id: abilityId,
      displayName: abilityDisplayName,
      gameDescription: gameEntry,
      effect: effectDescription,
    }
  } catch (err: any) {
    console.log(`Error fetching abilityId: ${abilityId} error ${err}`)
    return { id: "", displayName: "", gameDescription: "", effect: "" };
  }
}

async function fetchAllAbilities() {
  const abilityList = await axios.get(`${baseDatabaseUrl}/ability`) // get all abilities list
  const $ = cheerioLoad(abilityList.data)

  const allAbilities: string[] = []
  $('#abilities tbody tr td a').each((idx, ele) => {
    const href = $(ele).attr('href')
    if (href)
      allAbilities.push(getIdFromHref(href));
  })

  const abilityResult = await Promise.all(
    allAbilities.map(e => fetchAndParseAbility(e))
  )

  fs.writeFileSync('./src/assets/abilities.json', JSON.stringify(abilityResult.flat()))
}


async function downloadAllPokeImages() {
  const pokemonJSON = JSON.parse(fs.readFileSync('./src/assets/pokemon.json').toString()) as Pokemon[];

  // create poke image folder if it doesn't exist.
  if (!fs.existsSync('./src/assets/pokeimages')) {
    fs.mkdirSync('./src/assets/pokeimages')
  }

  const downloadPokeImage = async (poke: Pokemon) => {
    const filename = getIdFromHref(poke.imageUrl);
    const targetPath = `./src/assets/pokeimages/${filename}`
    if (fs.existsSync(targetPath))
      return;

    await downloadImage(poke.imageUrl, targetPath, true)
  }

  await Promise.all(pokemonJSON.map(e => downloadPokeImage(e)));
}

function verifyDataIntegrity() {
  if (!fs.existsSync('./src/assets/abilities.json'))
    throw new Error("Unable to find ./src/assets/abilities.json")
  if (!fs.existsSync('./src/assets/pokemon.json'))
    throw new Error("Unable to find ./src/assets/pokemon.json")

  // check that all pokemon abilities exist
  const abilitiesJSON = JSON.parse(fs.readFileSync('./src/assets/abilities.json').toString()) as Ability[]
  const pokemonJSON = JSON.parse(fs.readFileSync('./src/assets/pokemon.json').toString()) as Pokemon[]

  // verify proper definitions pokemons
  pokemonJSON.forEach((e) => PokemonSchema.parse(e))

  // verify proper definitions abilities
  abilitiesJSON.forEach((e) => AbilitySchema.parse(e))

  const allAbilities = new Set(abilitiesJSON.map(e => e.id));
  pokemonJSON.forEach(poke => {
    poke.abilitiesId.forEach(id => {
      if (!allAbilities.has(id))
        throw new Error(`Invalid Ability: ${id}`)
    })
  })

  // check that all images exist
  pokemonJSON.forEach(poke => {
    const filename = getIdFromHref(poke.imageUrl);
    if (!fs.existsSync(`./src/assets/pokeimages/${filename}`))
      throw new Error(`Missing image for: ${filename}`)
  })

  // check that all pokes in evos actually exists.
  const allPokes = pokemonJSON.map(e => e.id)
  const evoTrees = pokemonJSON.map(e => e.evoTree)

  console.log(evoTrees)
}

async function main() {
  // create assets directory if it doesn't exist
  if (!fs.existsSync('./src/assets')) {
    fs.mkdirSync('./src/assets')
  }

  // await Promise.all([fetchAllPokes(), fetchAllAbilities()]);

  await downloadAllPokeImages();
  verifyDataIntegrity();
}


main()

