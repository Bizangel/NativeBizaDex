import { Dex as BaseDex } from 'pokemon-showdown'
import axios from 'axios';
import fs from 'fs';
import { load as cheerioLoad } from 'cheerio';

const validNonStandards = [];

let Dex = BaseDex;  //BaseDex.mod('gen8')

function printAllNonstandardValues(pokeArray: any) {
  const x = new Set();
  pokeArray.forEach((ele: any) => {
    x.add(ele.isNonstandard)
  })
}

var allPoke = Dex.species.all();
var truePoke = allPoke.filter((e: any) =>
  (e.exists) && [null, "Past", "Future"].includes(e.isNonstandard)
)

const dexMapping = new Map<number, any>();

truePoke.forEach((ele: any) => {
  let samelist = dexMapping.get(ele.num);
  if (samelist === undefined)
    samelist = []

  samelist.push(ele)
  dexMapping.set(ele.num, samelist);
});


const dexNumberWithMultipleEntries: number[] = [];

dexMapping.forEach((a, b) => {
  if (a.length > 1) {
    // console.log(b)
    dexNumberWithMultipleEntries.push(b)
  }
})

// async function downloadPokeImage(pokedexIndex: number) {
//   try {
//     const paddedNumber = pokedexIndex.toString().padStart(3, '0');
//     const targetImagePath = `./assets/pokeimages/${pokedexIndex}.png`
//     if (fs.existsSync(targetImagePath))
//       return;

//     const response = await axios.get(`https://assets.pokemon.com/assets/cms2/img/pokedex/full/${paddedNumber}.png`, { responseType: 'arraybuffer' });
//     const imageData = Buffer.from(response.data, 'binary');

//     fs.writeFileSync(targetImagePath, imageData);
//   } catch (error: any) {
//     console.warn('Error downloading the image:', error.message);
//   }
// }


async function getFetchPokeOptions(pokeName: string): Promise<string[]> {
  try {
    const response = await axios.get(`https://www.pokemon.com/us/pokedex/${pokeName}`);
    const html = response.data;
    const $ = cheerioLoad(html);

    const options: string[] = [];

    $('#formes option').each((index, element) => {
      const text = $(element).text().trim();
      options.push(text);
    });

    return options;
  } catch (error: any) {
    console.error(`Error scraping data for ${pokeName}:`, error.message);
    return [];
  }
}


// console.log(Array.from(dexMapping.keys()).reduce((a, b) => Math.max(a, b)))
// dexMapping.forEach((pokeEntryList, index) => {
//   downloadPokeImage(index)
// })

async function verifyEntry(pokeName: string, pokeIndex: number) {
  const options = await getFetchPokeOptions(pokeName)
  if (options.length !== dexMapping.get(pokeIndex).length)
    console.warn(`Different mapping for: ${pokeIndex} ${pokeName}`)
}

dexNumberWithMultipleEntries.forEach(e => {
  verifyEntry(dexMapping.get(e)[0].id, e)
})

// getFetchPokeOptions("charmander")
console.log(dexMapping.get(855))