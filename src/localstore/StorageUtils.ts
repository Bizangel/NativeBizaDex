
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalStorageState, useZustandStorage } from "./storage";

// In theory, while app is running in memory, there's no need to re-read from the store.
// So values are only read once from storage, and they are marked as "initialized", never to be re-read again...
// until memory is lost / app is closed.
const initializedValues = new Set<string>()
const requestValueInitialization = async (key: string) => {
  if (initializedValues.has(key))
    return;

  initializedValues.add(key);

  try {
    const fetchedValue = await AsyncStorage.getItem("globalStorage-" + key);
    if (fetchedValue) {
      useZustandStorage.setState(prev => { return { ...prev, [key]: JSON.parse(fetchedValue) } });
    }
  } catch (e) {
    console.error("error reading default value")
  }
}

const subsRequest2key = new Map<keyof LocalStorageState, number>();

function ensureSubscriptionChangesAreSynchronized(key: keyof LocalStorageState) {
  const reqs = subsRequest2key.get(key) ?? 0;
  subsRequest2key.set(key, reqs + 1);

  return () => {
    const curr = subsRequest2key.get(key) ?? 0;
    if (curr < 2) { // clear sub
      subsRequest2key.delete(key);
    } else {
      subsRequest2key.set(key, curr - 1);
    }
  }
}

const writeChangesToStorage = async (key: string, newVal: string) => {
  try {
    await AsyncStorage.setItem("globalStorage-" + key, newVal);
  } catch (e) {
    console.error("Failed to write value")
  }
}


const StorageUtils = {
  writeChangesToStorage,
  ensureSubscriptionChangesAreSynchronized,
  requestValueInitialization,
  subsRequest2key
}

export default StorageUtils;
