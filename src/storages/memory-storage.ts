import { SyncStorage } from '../classes/sync-storage.js'
import { MEMORY_STORAGE_MAP } from '../definitions/constants.js'
import { StorageName } from '../definitions/enums.js'

/**
 * The `MemoryStorage` is a `SyncStorage` that uses a `Map` as its storage, which means that it will only be available in the current session.
 *
 * [Aracna Reference](https://aracna.dariosechi.it/core/storages/memory-storage)
 */
export const MemoryStorage: SyncStorage = new SyncStorage(
  StorageName.MEMORY,
  () => MEMORY_STORAGE_MAP.clear(),
  (key: string) => MEMORY_STORAGE_MAP.get(key) ?? {},
  (key: string) => MEMORY_STORAGE_MAP.has(key),
  (key: string) => MEMORY_STORAGE_MAP.delete(key),
  (key: string, value: any) => MEMORY_STORAGE_MAP.set(key, value)
)
