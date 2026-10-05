import { beforeEach, describe, expect, it, vi } from 'vitest'
import { IDBFactory } from 'fake-indexeddb'

describe('local STP cache', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    localStorage.clear()
    vi.resetModules()
  })

  it('saves a single local file and reads it back', async () => {
    const mod = await import('./local-stp-files')
    await mod.ensureLocalStpCacheReady()

    const before = mod.localStpCacheVersion.value
    const id = await mod.saveFile3D('part.stp', 'AAA', 'stp')

    expect(id).toBe(mod.LOCAL_STP_FILE_ID)
    expect(mod.localStpCacheVersion.value).toBeGreaterThan(before)
    expect(mod.getLocalStpFiles()).toHaveLength(1)
    expect(mod.getLocalStpFileById(id)?.file_name).toBe('part.stp')
    expect(mod.getLocalStpFileById(String(id))?.file_data).toBe('AAA')
  })

  it('keeps only the latest uploaded model', async () => {
    const mod = await import('./local-stp-files')
    await mod.saveFile3D('first.stp', '1', 'stp')
    await mod.saveFile3D('second.stp', '2', 'stp')

    const files = mod.getLocalStpFiles()
    expect(files).toHaveLength(1)
    expect(files[0].file_name).toBe('second.stp')
  })

  it('migrates a legacy localStorage entry into IndexedDB on first load', async () => {
    localStorage.setItem(
      'uploaded_stp_files',
      JSON.stringify([
        {
          id: -1,
          file_name: 'legacy.stp',
          file_data: 'LEGACY',
          file_type: 'stp',
          created_at: '2026-01-01T00:00:00.000Z',
        },
      ])
    )

    const mod = await import('./local-stp-files')
    await mod.ensureLocalStpCacheReady()

    expect(localStorage.getItem('uploaded_stp_files')).toBeNull()
    expect(mod.getLocalStpFiles()[0]?.file_name).toBe('legacy.stp')
    expect(mod.getLocalStpFileById(-1)?.file_data).toBe('LEGACY')
  })

  it('ignores corrupt legacy localStorage data without clearing the key on parse failure', async () => {
    localStorage.setItem('uploaded_stp_files', '{not-json')
    const mod = await import('./local-stp-files')
    await mod.ensureLocalStpCacheReady()
    expect(mod.getLocalStpFiles()).toEqual([])
    // removeItem only runs after a successful JSON.parse
    expect(localStorage.getItem('uploaded_stp_files')).toBe('{not-json')
  })
})

describe('legacy localStorage with nothing to migrate', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    vi.resetModules()
  })

  it.each(['[]', '{"id":-1}'])('drops the legacy key %s and keeps the cache empty', async (raw) => {
    localStorage.setItem('uploaded_stp_files', raw)
    const mod = await import('./local-stp-files')
    await mod.ensureLocalStpCacheReady()

    expect(localStorage.getItem('uploaded_stp_files')).toBeNull()
    expect(mod.getLocalStpFiles()).toEqual([])
  })
})

type FakeRequest = {
  result: unknown
  error: DOMException | null
  onsuccess: (() => void) | null
  onerror: (() => void) | null
  onupgradeneeded: ((event: unknown) => void) | null
}

const fakeRequest = (result: unknown, error: DOMException | null = null): FakeRequest => ({
  result,
  error,
  onsuccess: null,
  onerror: null,
  onupgradeneeded: null,
})

describe('IndexedDB failures', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it('rejects and allows a retry when the database cannot be opened', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    const openError = new DOMException('blocked', 'InvalidStateError')
    const openRequests: FakeRequest[] = []
    globalThis.indexedDB = {
      open: () => {
        const request = fakeRequest(undefined, openError)
        openRequests.push(request)
        return request
      },
    } as unknown as IDBFactory

    const mod = await import('./local-stp-files')
    // Same pending promise the module started on import, so the rejection is observed here.
    const ready = mod.ensureLocalStpCacheReady()
    expect(openRequests).toHaveLength(1)
    openRequests[0].onerror?.()

    await expect(ready).rejects.toBe(openError)
    expect(consoleError).toHaveBeenCalledWith('Failed to initialize STP files cache:', openError)
    expect(mod.localStpCacheVersion.value).toBe(0)

    globalThis.indexedDB = new IDBFactory()
    await expect(mod.ensureLocalStpCacheReady()).resolves.toBeUndefined()
    expect(mod.localStpCacheVersion.value).toBe(1)
    consoleError.mockRestore()
  })

  const installFakeDb = (saveOutcome: 'request-error' | 'tx-error') => {
    const close = vi.fn()
    const requestError = new DOMException('put failed', 'DataError')
    const txError = new DOMException('tx aborted', 'AbortError')
    let transactions = 0

    const db = {
      close,
      transaction: () => {
        const isSave = transactions++ > 0
        const request = fakeRequest([], requestError)
        const tx = {
          error: txError,
          onerror: null as (() => void) | null,
          oncomplete: null as (() => void) | null,
          objectStore: () => ({ clear: () => {}, put: () => request, getAll: () => request }),
        }
        queueMicrotask(() => {
          if (!isSave) tx.oncomplete?.()
          else if (saveOutcome === 'request-error') request.onerror?.()
          else tx.onerror?.()
        })
        return tx
      },
    }

    globalThis.indexedDB = {
      open: () => {
        const request = fakeRequest(db)
        queueMicrotask(() => request.onsuccess?.())
        return request
      },
    } as unknown as IDBFactory

    return { close, requestError, txError }
  }

  it('rejects saveFile3D when the put request fails and still closes the db', async () => {
    const { close, requestError } = installFakeDb('request-error')
    const mod = await import('./local-stp-files')
    await mod.ensureLocalStpCacheReady()
    expect(close).toHaveBeenCalledTimes(1)

    await expect(mod.saveFile3D('part.stp', 'AAA', 'stp')).rejects.toBe(requestError)
    expect(close).toHaveBeenCalledTimes(2)
    expect(mod.getLocalStpFiles()).toEqual([])
  })

  it('rejects saveFile3D when the transaction fails', async () => {
    const { close, txError } = installFakeDb('tx-error')
    const mod = await import('./local-stp-files')
    await mod.ensureLocalStpCacheReady()
    const version = mod.localStpCacheVersion.value

    await expect(mod.saveFile3D('part.stp', 'AAA', 'stp')).rejects.toBe(txError)
    expect(close).toHaveBeenCalledTimes(2)
    expect(mod.localStpCacheVersion.value).toBe(version)
    expect(mod.getLocalStpFileById(mod.LOCAL_STP_FILE_ID)).toBeNull()
  })
})

describe('IndexedDB schema upgrade', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.resetModules()
  })

  it.each([
    [false, 1],
    [true, 0],
  ])('store already present = %s → createObjectStore called %i times', async (exists, calls) => {
    const createObjectStore = vi.fn()
    const upgradeDb = { objectStoreNames: { contains: () => exists }, createObjectStore }
    const db = {
      close: vi.fn(),
      transaction: () => {
        const request = fakeRequest([])
        const tx = {
          oncomplete: null as (() => void) | null,
          objectStore: () => ({ getAll: () => request }),
        }
        queueMicrotask(() => tx.oncomplete?.())
        return tx
      },
    }
    globalThis.indexedDB = {
      open: () => {
        const request = fakeRequest(db)
        queueMicrotask(() => {
          request.onupgradeneeded?.({ target: { result: upgradeDb } })
          request.onsuccess?.()
        })
        return request
      },
    } as unknown as IDBFactory

    const mod = await import('./local-stp-files')
    await mod.ensureLocalStpCacheReady()

    expect(createObjectStore).toHaveBeenCalledTimes(calls)
    if (calls) expect(createObjectStore).toHaveBeenCalledWith('stp_files', { keyPath: 'id' })
    expect(mod.getLocalStpFiles()).toEqual([])
  })
})

describe('file id classification', () => {
  beforeEach(() => {
    globalThis.indexedDB = new IDBFactory()
    localStorage.clear()
    vi.resetModules()
  })

  it('never treats demo or local ids as conflicting server lookups', async () => {
    const mod = await import('./local-stp-files')
    await mod.saveFile3D('local.stp', 'data', 'stp')

    expect(mod.getLocalStpFileById(1)).toBeNull()
    expect(mod.getLocalStpFileById(2)).toBeNull()
    expect(mod.isServerFileId(1)).toBe(true)
    expect(mod.isServerFileId(mod.LOCAL_STP_FILE_ID)).toBe(false)
    expect(mod.isServerFileId(0)).toBe(false)
    expect(mod.isServerFileId('x')).toBe(false)
    expect(mod.isServerFileId(2147483648)).toBe(false)
    expect(mod.toServerFileId(42)).toBe(42)
    expect(mod.toServerFileId(mod.LOCAL_STP_FILE_ID)).toBeUndefined()
  })

  it('builds calculate fields from a local file or a server id', async () => {
    const mod = await import('./local-stp-files')
    await mod.saveFile3D('local.stp', 'data', 'stp')

    expect(mod.buildCalculateFileFields(mod.LOCAL_STP_FILE_ID)).toEqual({
      file_type: 'stp',
      file_name: 'local.stp',
      file_data: 'data',
    })
    expect(mod.buildCalculateFileFields(99)).toEqual({ file_id: 99 })
    expect(mod.buildCalculateFileFields(null)).toEqual({})
  })

  it('detects whether a calculate payload has a model', async () => {
    const mod = await import('./local-stp-files')
    await mod.saveFile3D('local.stp', 'data', 'stp')

    expect(mod.hasCalculateModel({ file_data: 'x' })).toBe(true)
    expect(mod.hasCalculateModel({ file_id: 10 })).toBe(true)
    expect(mod.hasCalculateModel({ file_id: mod.LOCAL_STP_FILE_ID })).toBe(true)
    expect(mod.hasCalculateModel({})).toBe(false)
  })
})
