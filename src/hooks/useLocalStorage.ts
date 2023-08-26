import { useEffect, useState, useCallback } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export function useLocalStorage<T>(key: string, defaultValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {

  const [syncVal, setSyncVal] = useState<T>(defaultValue);

  const initializeDefaultValue = useCallback(async () => {
    try {
      const fetchedValue = await AsyncStorage.getItem(key);
      if (fetchedValue) {
        setSyncVal(JSON.parse(fetchedValue));
      }
    } catch (e) {
      console.log("error reading default value")
    }
  }, [key])

  const writeChangesToStorage = useCallback(async (newVal: string) => {
    try {
      await AsyncStorage.setItem(key, newVal);
    } catch (e) {
      console.log("Failed to write value")
    }
  }, [key])

  useEffect(() => {
    initializeDefaultValue(); // attempt to read on mount, read if there's any previously stored value.
  }, [initializeDefaultValue])

  // reflect anychanges done to syncvalue in the storage.
  useEffect(() => {
    writeChangesToStorage(JSON.stringify(syncVal));
  }, [syncVal, writeChangesToStorage])

  return [syncVal, setSyncVal]
}