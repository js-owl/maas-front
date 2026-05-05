export const LOCAL_STP_FILES_KEY = 'uploaded_stp_files'

export type LocalStpFile = {
  id: number
  file_name: string
  file_data: string
  file_type: string
  created_at: string
}

export const getLocalStpFiles = (): LocalStpFile[] => {
  try {
    const stored = localStorage.getItem(LOCAL_STP_FILES_KEY)
    const files = stored ? JSON.parse(stored) : []

    return Array.isArray(files) ? files : []
  } catch (error) {
    console.error('Error reading STP files from localStorage:', error)
    return []
  }
}

export const getLocalStpFileById = (id: number | string | null | undefined) => {
  const numericId = Number(id)
  if (!Number.isFinite(numericId)) return null

  return getLocalStpFiles().find((file) => file.id === numericId) || null
}

export const saveFile3D = (fileName: string, fileData: string, fileType: string): number => {
  const files = getLocalStpFiles()
  const lastId = files.reduce((maxId, file) => Math.max(maxId, file.id), 0)
  const id = Math.max(Date.now(), lastId + 1)

  const file: LocalStpFile = {
    id,
    file_name: fileName,
    file_data: fileData,
    file_type: fileType,
    created_at: new Date().toISOString(),
  }

  localStorage.removeItem(LOCAL_STP_FILES_KEY)
  localStorage.setItem(LOCAL_STP_FILES_KEY, JSON.stringify([file]))

  return id
}
