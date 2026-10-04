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
