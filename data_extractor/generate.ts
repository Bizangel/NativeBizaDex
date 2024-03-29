import axios from 'axios';
import { load as cheerioLoad } from 'cheerio';
import { getIdFromHref, getPokeIdFromImageUrl, handleIdExceptions, parseEvolveTree, lowercaseAZNormalize, withProgressBarTick } from './utils';
import { Ability, AbilitySchema, BaseStat, BaseStatName, PokeType, Pokemon, PokemonSchema } from '../src/types/Pokemon';
import fs from "fs";
import CliProgress from "cli-progress"

const excludedPokemonId = new Set(["eternatus-eternamax"]); // ensure to exclude so that everything is valid ! (don't exclude an evo and forget to exclude its prevo)

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

  tabRawName: string,

  tabId: string,
  dexEntry: string,
  generationalChanges: string[],

  evoTree: Record<string, { evolveReason: string, pokeId: string }[]>,

  pokeFullURL: string,
  tabIndex: number,
}

async function getPokevariantsTabs(html: any, originUrl: string): Promise<TabInfo[]> {
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
    let displayName = $(ele).text().trim()
    const rawTabName = displayName;

    if (!lowercaseAZNormalize(displayName).includes(lowercaseAZNormalize(mainpageFullName))) {
      // displayname doesn't have name so add it
      displayName = `${mainpageFullName} (${displayName})`
    }

    if (id) {// remove id hash at start
      result.push({
        displayName: displayName, tabId: id.replace(/^#/, ''),
        dexEntry: pokedexEntry,
        generationalChanges: generationalChanges,
        evoTree: evoTree,
        tabRawName: rawTabName,
        pokeFullURL: originUrl,
        tabIndex: e
      });
    }
  })


  return result;
}


function parsePokeTab(html: any,
  tabInfo: TabInfo): Pokemon {
  const $ = cheerioLoad(html);

  const tab = $(`#${tabInfo.tabId}`).first();


  // get image and use that as unique identifier!
  const imageSrc = tab.find('img').first().attr('src')
  if (!imageSrc)
    throw new Error("Unable to parse html, could not find image href")

  // get ID from image
  let pokeId = getPokeIdFromImageUrl(imageSrc)

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

  const isMega = pokeId.endsWith(' mega') || pokeId.endsWith('-mega') || pokeId.includes('-mega-'); // works for charizard x / y

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

    evoTree: tabInfo.evoTree,
    variantName: tabInfo.tabRawName,
    scrapedInfoUrl: tabInfo.pokeFullURL,
    variantIndex: tabInfo.tabIndex,
  }

  // validate it
  const validated = PokemonSchema.parse(handleIdExceptions(returnPoke));
  return validated
}


async function getPokemonFromUrl(url: string): Promise<Pokemon[]> {
  try {
    const response = await axios.get(`${baseDatabaseUrl}${url}`);
    if (response.status !== 200)
      throw new Error(`Could not fetch data for ${url}`)

    const html = response.data;

    const tabsPoke = await getPokevariantsTabs(html, url);
    const poke = tabsPoke.map(e => parsePokeTab(html, e))

    return poke.filter(e => !excludedPokemonId.has(e.id));
  }

  catch (err: any) {
    console.log(`Error fetching: ${url} error ${err}`)
    return [];
  }
}

async function fetchAllPokes(multiBar: CliProgress.MultiBar) {
  const dexMapping = await getDexMappingToURL()

  let prevPokemon: Pokemon[] = [];
  if (fs.existsSync("./src/assets/pokemon.json")) {
    prevPokemon = JSON.parse(fs.readFileSync('./src/assets/pokemon.json').toString())
  }

  const pokeUrlsAlreadyDownloaded = new Set(prevPokemon.map(e => e.scrapedInfoUrl))

  let allhrefs = Array.from(dexMapping.values())

  const pokeProgressBar = multiBar.create(allhrefs.length, 0, { barDisplay: "Downloading Pokemon  ".padEnd(20, ' ') })
  const getPokemonFromUrlWithTick = withProgressBarTick(getPokemonFromUrl, pokeProgressBar)

  allhrefs = allhrefs.filter(e => !pokeUrlsAlreadyDownloaded.has(e)); // avoid redownloads
  const pokeResult = await Promise.all(
    allhrefs.map(e => getPokemonFromUrlWithTick(e))
  )

  const toWritePokeResult = [...pokeResult.flat(), ...prevPokemon];
  // sort by dex -> variant
  toWritePokeResult.sort((a, b) => a.nationalDexNumber === b.nationalDexNumber ? a.variantIndex - b.variantIndex : a.nationalDexNumber - b.nationalDexNumber)
  fs.writeFileSync('./src/assets/pokemon.json', JSON.stringify(toWritePokeResult))
}

async function fetchAndParseAbility(abilityId: string): Promise<Ability> {
  try {
    const resp = await axios.get(`${baseDatabaseUrl}/ability/${abilityId}`)
    const html = resp.data;

    const $ = cheerioLoad(html);

    const h1title = $('main h1').first()
    const abilityDisplayName = h1title.contents().filter((index, node) => node.nodeType === 3).text().trim();

    // get effect description
    const effectH2 = $(`h2:contains("Effect")`).first();
    const effectDescription = effectH2.nextUntil('h2, h3').text().trim();

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

async function fetchAllAbilities(multiBar: CliProgress.MultiBar) {
  // check if some abilities have been fetched to avoid duplication.
  let prevAbilities: Ability[] = [];
  if (fs.existsSync("./src/assets/abilities.json")) {
    prevAbilities = JSON.parse(fs.readFileSync('./src/assets/abilities.json').toString())
  }

  const alreadyFetchedAbilities = new Set(prevAbilities.map(e => e.id))

  const abilityList = await axios.get(`${baseDatabaseUrl}/ability`) // get all abilities list
  const $ = cheerioLoad(abilityList.data)

  let allAbilities: string[] = []
  $('#abilities tbody tr td a').each((idx, ele) => {
    const href = $(ele).attr('href')
    if (href)
      allAbilities.push(getIdFromHref(href));
  })

  // remove already fetched abilities
  allAbilities = allAbilities.filter(e => !alreadyFetchedAbilities.has(e));

  const abilityProgressBar = multiBar.create(allAbilities.length, 0, { barDisplay: "Downloading Abilities".padEnd(20, ' ') })
  const fetchAndParseAbilityWithTick = withProgressBarTick(fetchAndParseAbility, abilityProgressBar)

  let abilityResult = await Promise.all(
    allAbilities.map(e => fetchAndParseAbilityWithTick(e))
  )

  abilityResult = [...abilityResult, ...prevAbilities]; // mix with previous abilities

  // sort alphabetically
  abilityResult.sort((a, b) => a.displayName.toLowerCase() < b.displayName.toLowerCase() ? -1 : 1)

  fs.writeFileSync('./src/assets/abilities.json', JSON.stringify(abilityResult.flat()))
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

  // make a list of all PokeIds, also check that there are no repeated-ids
  const allPokes = new Set<string>();

  // check that all pokes in evos actually exists.
  pokemonJSON.forEach(e => {
    if (allPokes.has(e.id))
      throw new Error(`Repeated poke id: ${e.id}`)

    allPokes.add(e.id);
  })

  const evoTrees = pokemonJSON.map(e => e.evoTree)

  evoTrees.forEach(evoTree => {
    Object.keys(evoTree).forEach(e => {
      if (!allPokes.has(e)) {
        throw new Error(`Invalid evo doesn't exist: ${e}`)
      }
    })

    Object.values(evoTree).flat().map(e => {
      if (!allPokes.has(e.pokeId)) {
        throw new Error(`Invalid evo doesn't exist: ${e.pokeId}`)
      }
    })
  })

  // check that ids and displays names are consistent.
  // Some display names might be "Three-Segment Form" which is not truly a display name.
  // thus every segment (word splitted by dash -) should be contained in some way in the display name.
  pokemonJSON.forEach((e) => {
    e.id.split("-").forEach(id_split => {
      if (id_split.length < 3) // ignore it if too short split
        return;

      if (!lowercaseAZNormalize(e.displayName).includes(lowercaseAZNormalize(id_split)))
        throw new Error(`ID doesn't match with display name: ${e.id} | ${e.displayName}`)

    })
  })
}

async function main() {
  // create assets directory if it doesn't exist
  if (!fs.existsSync('./src/assets')) {
    fs.mkdirSync('./src/assets')
  }

  // create new container
  const pokeBarProgress = new CliProgress.MultiBar({
    clearOnComplete: false,
    hideCursor: true,
    format: '{barDisplay} {bar} | {value}/{total} Pokemon | Elapsed: {duration_formatted} | Eta: {eta_formatted}',
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
  });

  await Promise.all([fetchAllPokes(pokeBarProgress), fetchAllAbilities(pokeBarProgress)]);
  pokeBarProgress.stop();

  verifyDataIntegrity(); // if didn't throw error
  console.log("Successfully downloaded and generate data. Proceed to run npm imagegen")
}


main()

