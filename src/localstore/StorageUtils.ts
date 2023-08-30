
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LocalStorageState, useZustandStorage } from "./storage";

// In theory, while app is running in memory, there's no need to re-read from the store.
// So values are only read once from storage, and they are marked as "initialized", never to be re-read again...
// until memory is lost / app is closed.
const initializedValues = new Set<string>()
export const requestZustandStoreValueInitialization = async (key: string) => {
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

export const zustandRequestedSubscriptionKeys = new Map<keyof LocalStorageState, number>();

export function ensureZustandSubscriptionChangesAreSynchronized(key: keyof LocalStorageState) {
  const reqs = zustandRequestedSubscriptionKeys.get(key) ?? 0;
  zustandRequestedSubscriptionKeys.set(key, reqs + 1);

  return () => {
    const curr = zustandRequestedSubscriptionKeys.get(key) ?? 0;
    if (curr < 2) { // clear sub
      zustandRequestedSubscriptionKeys.delete(key);
    } else {
      zustandRequestedSubscriptionKeys.set(key, curr - 1);
    }
  }
}

export const writeToLocalAsyncStorage = async (key: string, newVal: string) => {
  try {
    await AsyncStorage.setItem("globalStorage-" + key, newVal);
  } catch (e) {
    console.error("Failed to write value")
  }
}