import fs from 'fs'
import axios from 'axios'
import { load as cheerioLoad } from 'cheerio';
import { Pokemon } from '../src/types/Pokemon';

export async function downloadImage(imageUrl: string, localTargetLocation: string, override = false) {
  try {
    if (!override && fs.existsSync(localTargetLocation))
      return;

    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });

    const imageData = Buffer.from(response.data, 'binary');

    fs.writeFileSync(localTargetLocation, imageData);
  } catch (error: any) {
    console.warn(`Error downloading the image from ${imageUrl}:`, error.message);
  }
}


export function getPokeIdFromImageUrl(imageUrl: string) {
  const startIndex = imageUrl.lastIndexOf('/') + 1;
  const endIndex = imageUrl.lastIndexOf('.');
  const extractedString = imageUrl.substring(startIndex, endIndex);
  return extractedString;
}

export function getIdFromHref(href: string) {
  const startIndex = href.lastIndexOf('/') + 1;
  const extractedString = href.substring(startIndex, href.length);
  return extractedString;
}

function addToEvoTree(
  evoTree: Record<string, { evolveReason: string, pokeId: string }[]>,
  newNodeId: string,
  ele: { evolveReason: string, pokeId: string }) {

  const prev = evoTree[newNodeId];
  if (prev) {
    prev.push(ele);
  } else {
    evoTree[newNodeId] = [ele];
  }
}

export function parseEvolveTree(html: any) {
  const $ = cheerioLoad(html);

  let startingEvo: string | undefined;

  const evoTree: Record<string, { evolveReason: string, pokeId: string }[]> = {}

  $('.infocard-list-evo .infocard:not(.info-card-arrow) ').each((idx, infocard) => {
    const hrefAttr = $(infocard).find('.infocard-lg-img img').attr('src');
    if (!hrefAttr)
      return;

    const nodeId = getPokeIdFromImageUrl(hrefAttr)

    if (startingEvo === undefined) {
      startingEvo = nodeId;
    }

    const nextEle = $(infocard).next()

    if (nextEle.hasClass('infocard-evo-split')) {
      nextEle.find('.infocard-arrow').each((_, arrowEle) => {
        const reason = $(arrowEle).text().trim();
        const possibleTarget = $(arrowEle).next().find('.infocard-lg-img img').attr('src');
        if (possibleTarget) {
          addToEvoTree(evoTree, nodeId,
            { evolveReason: reason, pokeId: getPokeIdFromImageUrl(possibleTarget) })
        }
      }) // find all arrows
    }

    if (nextEle.hasClass('infocard-arrow')) {
      const reason = nextEle.text().trim();
      const possibleTarget = nextEle.next().find('.infocard-lg-img img').attr('src');
      if (possibleTarget) {
        addToEvoTree(evoTree, nodeId,
          { evolveReason: reason, pokeId: getPokeIdFromImageUrl(possibleTarget) })
      }

    }
  })

  if (startingEvo === undefined && Object.keys(evoTree).length > 0) // it can be undefined, if pokemon doesn't evolve (evotree is empty.)
    throw new Error(`Unable to find starting evo for ${JSON.stringify(evoTree)}`)

  return { evoTree: evoTree, startingEvo: startingEvo };
}


/** Removes all non A-Z characters, including numbers, removes accentuation keeping spaces, and also making the string lowecase */
export function lowercaseAZNormalize(str: string) {
  return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z ]/g, '')
}

export function handleIdExceptions(pokemon: Pokemon): Pokemon {
  // it was either this, or accepting duplicate names in ids? at least the fix is not that bad.

  if (pokemon.id === "pumpkaboo") {
    return { ...pokemon, id: "pumpkaboo-" + (lowercaseAZNormalize(pokemon.displayName.split(" ")[1])) }
  }

  if (pokemon.id === "gourgeist") {
    return { ...pokemon, id: "gourgeist-" + (lowercaseAZNormalize(pokemon.displayName.split(" ")[1])) }
  }

  if (pokemon.id === "rockruff" && pokemon.displayName.startsWith("Own")) {
    return { ...pokemon, id: "rockruff-own-tempo" }
  }

  if (pokemon.id === "dudunsparce") { // two-segment id works properly for some reason.
    return { ...pokemon, id: "dudunsparce-three-segment" }
  }

  if (pokemon.id === "pikachu-lets-go") {
    return { ...pokemon, id: "pikachu-partner" }
  }

  if (pokemon.id === "eevee-lets-go") {
    return { ...pokemon, id: "eevee-partner" }
  }

  if (pokemon.id === "nidoran-m") {
    return { ...pokemon, displayName: "Nidoran (male)" }
  }

  if (pokemon.id === "nidoran-f") {
    return { ...pokemon, displayName: "Nidoran (female)" }
  }



  if (pokemon.id.startsWith("tauros-")) {
    return { ...pokemon, displayName: `Paldean ${pokemon.displayName}` }
  }

  // if (pokemon.id.startsWith("castform-")) {
  //   return { ...pokemon, displayName: `Castform (${pokemon.displayName})` }
  // }

  // if (pokemon.id.startsWith("deoxys-")) {
  //   return { ...pokemon, displayName: `Deoxys (${pokemon.displayName})` }
  // }

  // if (pokemon.id.startsWith("burmy-")) {
  //   return { ...pokemon, displayName: `Burmy (${pokemon.displayName})` }
  // }

  // if (pokemon.id.startsWith("wormadam-")) {
  //   return { ...pokemon, displayName: `Wormadam (${pokemon.displayName})` }
  // }

  // if (pokemon.id.startsWith("dialga-")) {
  //   return { ...pokemon, displayName: `Dialga (${pokemon.displayName})` }
  // }

  // if (pokemon.id.startsWith("palkia-")) {
  //   return { ...pokemon, displayName: `Palkia (${pokemon.displayName})` }
  // }

  // if (pokemon.id.startsWith("giratina-")) {
  //   return { ...pokemon, displayName: `Giratina (${pokemon.displayName})` }
  // }

  // if (pokemon.id.startsWith("shaymin-")) {
  //   return { ...pokemon, displayName: `Shaymin (${pokemon.displayName})` }
  // }







  return pokemon;
}