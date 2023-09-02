import { usePersistentStorage } from "../localstore/storage";

export function SerializeStore() {
  const serialized = JSON.stringify(usePersistentStorage.getState());
  console.log(serialized)
}

export function ExportDataViaClipboard() {

}