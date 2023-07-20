import fs from 'fs'
import axios from 'axios'
import { load as cheerioLoad } from 'cheerio';

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

  const evoTree: Record<string, { evolveReason: string, pokeId: string }[]> = {}

  $('.infocard-list-evo .infocard:not(.info-card-arrow) ').each((idx, infocard) => {
    const hrefAttr = $(infocard).find('.infocard-lg-img a').attr('href');
    if (!hrefAttr)
      return;
    const nodeId = getIdFromHref(hrefAttr)

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

  return evoTree;
}

