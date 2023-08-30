import { LocalStorageFunctions, LocalStorageState, useZustandStorage } from "./storage";
import { useEffect } from "react"
import StorageUtils from "./storageUtils";

type ValueOf<T> = T[keyof T];


export function usePersistentStorage<T extends keyof LocalStorageState>(key: T): LocalStorageState[T];
export function usePersistentStorage<T extends keyof LocalStorageState, V>(key: T, getter: ((x: LocalStorageState[T]) => V)): V;
export function usePersistentStorage<T extends keyof LocalStorageState, V>(
  key: T,
  getter?: ((x: LocalStorageState[T]) => V), // Make the getter parameter optional
): V | LocalStorageState[T] {
  const state = useZustandStorage(e => getter ? getter(e[key]) : e[key]);

  useEffect(() => {
    StorageUtils.requestValueInitialization(key); // read stored value
    StorageUtils.ensureSubscriptionChangesAreSynchronized(key); // ensure that key updates are being sent
  }, [key])


  return state;
}


/** Returns custom defined functions to modify the local storage. */
export function useModifyPersistentStorage<T extends ValueOf<LocalStorageFunctions>>(getter: (e: LocalStorageFunctions) => T): T {
  return useZustandStorage(getter);
}

/** Intented to only be called once. Ensures that the persistent storage is syncrhonized with in memory zustand storage.  */
export function usePersistentStorageSynchronization() {
  useEffect(() => {
    const unsub = useZustandStorage.subscribe((state) => {
      Array.from(StorageUtils.subsRequest2key.keys()).forEach(key => {
        StorageUtils.writeChangesToStorage(key, JSON.stringify(state[key]))
      })
    })
    return unsub;
  }, [])
}
