import { StoredPokedex } from "../common/pokeInfo";
import { usePersistentStorage } from "../localstore/storage";

const usePersistentActiveDex = <T>(propertySelector: (dex: StoredPokedex) => T): T | null => {
  return usePersistentStorage(e => {
    const activeDex = e.activePokedexIndex !== null ? e.allStoredPokedexes[e.activePokedexIndex] : null;
    return activeDex ? propertySelector(activeDex) : null;
  });
}

export default usePersistentActiveDex;
