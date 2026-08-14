import { ref } from 'vue'

// Legacy localStorage key — used only for one-time migration to IndexedDB.
export const LOCAL_STP_FILES_KEY = 'uploaded_stp_files'

const DB_NAME = 'maas_stp_files'
const DB_VERSION = 1
const STORE_NAME = 'stp_files'

export type LocalStpFile = {
  id: number
  file_name: string
  file_data: string
  file_type: string
  created_at: string
}

// In-memory cache mirrors IndexedDB so synchronous reads stay available in computed().
const fileCache = new Map<number, LocalStpFile>()

// Bumped whenever cache content changes — lets Vue computeds re-run after async IDB hydration.
export const localStpCacheVersion = ref(0)

let cacheReadyPromise: Promise<void> | null = null

const bumpCacheVersion = () => {
  localStpCacheVersion.value++
}

const openDb = (): Promise<IDBDatabase> =>
  new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' })
      }
    }
  })

const runTransaction = <T>(
  db: IDBDatabase,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest<T>
): Promise<T> =>
  new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, mode)
    const store = tx.objectStore(STORE_NAME)
    const request = fn(store)

    request.onerror = () => reject(request.error)
    tx.onerror = () => reject(tx.error)
    tx.oncomplete = () => resolve(request.result)
  })

const migrateFromLocalStorage = (): LocalStpFile | null => {
  try {
    const stored = localStorage.getItem(LOCAL_STP_FILES_KEY)
    if (!stored) return null

    const files = JSON.parse(stored)
    localStorage.removeItem(LOCAL_STP_FILES_KEY)

    if (!Array.isArray(files) || files.length === 0) return null
    return files[files.length - 1] as LocalStpFile
  } catch (error) {
    console.error('Error migrating STP files from localStorage:', error)
    return null
  }
}

const loadCacheFromDb = async (): Promise<void> => {
  const migrated = migrateFromLocalStorage()
  const db = await openDb()

  try {
    if (migrated) {
      await runTransaction(db, 'readwrite', (store) => {
        store.clear()
        return store.put(migrated)
      })
      fileCache.clear()
      fileCache.set(migrated.id, migrated)
    } else {
      const files = await runTransaction<LocalStpFile[]>(db, 'readonly', (store) => store.getAll())
      fileCache.clear()
      files.forEach((file) => fileCache.set(file.id, file))
    }
  } finally {
    db.close()
  }

  bumpCacheVersion()
}

export const ensureLocalStpCacheReady = (): Promise<void> => {
  if (!cacheReadyPromise) {
    cacheReadyPromise = loadCacheFromDb().catch((error) => {
      console.error('Failed to initialize STP files cache:', error)
      cacheReadyPromise = null
      throw error
    })
  }

  return cacheReadyPromise
}

// Start hydration as soon as the module is imported.
ensureLocalStpCacheReady()

export const getLocalStpFiles = (): LocalStpFile[] => Array.from(fileCache.values())

export const getLocalStpFileById = (id: number | string | null | undefined): LocalStpFile | null => {
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) return null

  return fileCache.get(numericId) || null
}

/** Backend file_id columns are PostgreSQL int32. */
const INT32_MAX = 2147483647
const INT32_MIN = -2147483648

/** Stable local-only id — only one STP is kept in IndexedDB at a time. */
export const LOCAL_STP_FILE_ID = -1

export const isServerFileId = (id: number | string | null | undefined): boolean => {
  const numericId = Number(id)
  if (!Number.isFinite(numericId) || !Number.isInteger(numericId)) return false
  if (numericId <= 0) return false
  if (numericId > INT32_MAX || numericId < INT32_MIN) return false
  // Prefer cache: anything stored locally must not be sent as server file_id
  if (getLocalStpFileById(numericId)) return false
  return true
}

export const toServerFileId = (id: number | string | null | undefined): number | undefined => {
  const numericId = Number(id)
  if (!isServerFileId(numericId)) return undefined
  return numericId
}

/** Fields for /calculate-price: local models go as file_data, server models as file_id. */
export const buildCalculateFileFields = (
  fileId: number | string | null | undefined,
  localFile: LocalStpFile | null = getLocalStpFileById(fileId)
): { file_type: string; file_name: string; file_data: string } | { file_id: number } | Record<string, never> => {
  if (localFile) {
    return {
      file_type: localFile.file_type,
      file_name: localFile.file_name,
      file_data: localFile.file_data,
    }
  }

  const serverId = toServerFileId(fileId)
  return serverId != null ? { file_id: serverId } : {}
}

export const saveFile3D = async (fileName: string, fileData: string, fileType: string): Promise<number> => {
  await ensureLocalStpCacheReady()

  // Never use Date.now() — those values exceed int32 and break /calculate-price if sent as file_id.
  const id = LOCAL_STP_FILE_ID

  const file: LocalStpFile = {
    id,
    file_name: fileName,
    file_data: fileData,
    file_type: fileType,
    created_at: new Date().toISOString(),
  }

  const db = await openDb()

  try {
    // Keep previous behaviour: only the latest uploaded model is stored locally.
    await runTransaction(db, 'readwrite', (store) => {
      store.clear()
      return store.put(file)
    })
  } finally {
    db.close()
  }

  fileCache.clear()
  fileCache.set(id, file)
  bumpCacheVersion()

  return id
}
