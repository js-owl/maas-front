export const PRINTING_SERVICE_ID = 'printing'
/** Demo STL from maas-back/uploads/3d_models/demo_printing_default.stl */
export const DEFAULT_PRINTING_FILE_ID = 1
export const DEFAULT_PRINTING_FILE_NAME = 'demo_printing_default.stl'

const DEFAULT_MODEL_EXTENSIONS = ['stp']
const PRINTING_MODEL_EXTENSIONS = ['stl']

const DEFAULT_FORMATS_LABEL =
  'Допустимые форматы файлов: STEP, STP, IGES, IGS, SAT, SLDPRT, SLDASM, STL, OBJ, PLY, 3DS, DAE, FBX, BLEND'
const PRINTING_FORMATS_LABEL = 'Допустимые форматы файлов: STL'

export function getFileExtension(fileName: string): string {
  return fileName.split('.').pop()?.toLowerCase() ?? ''
}

export type CadViewerType = 'stl' | 'stp' | null

/** Detects STL/STP from file_type, original filename, or stored filename. */
export function resolveCadViewerType(...values: Array<string | null | undefined>): CadViewerType {
  for (const value of values) {
    if (!value) continue
    const normalized = String(value).replace(/^\./, '').toLowerCase()
    const extension = normalized.includes('.') ? getFileExtension(normalized) : normalized
    if (extension === 'stl') return 'stl'
    if (extension === 'stp' || extension === 'step') return 'stp'
  }
  return null
}

export function isPrintingService(serviceId?: string | null): boolean {
  return serviceId === PRINTING_SERVICE_ID
}

export function getModelExtensionsForService(serviceId?: string | null): string[] {
  return isPrintingService(serviceId) ? PRINTING_MODEL_EXTENSIONS : DEFAULT_MODEL_EXTENSIONS
}

export function isAllowedModelFile(fileName: string, serviceId?: string | null): boolean {
  const extension = getFileExtension(fileName)
  return extension !== '' && getModelExtensionsForService(serviceId).includes(extension)
}

export function getGuestModelOnlyMessage(serviceId?: string | null): string {
  return isPrintingService(serviceId)
    ? 'Без авторизации можно загружать только STL-файлы.'
    : 'Без авторизации можно загружать только STP-файлы.'
}

export function getGuestSingleModelMessage(serviceId?: string | null): string {
  return isPrintingService(serviceId)
    ? 'Без авторизации можно загрузить только один STL-файл.'
    : 'Без авторизации можно загрузить только один STP-файл.'
}

export function getModelFormatsLabel(serviceId?: string | null): string {
  return isPrintingService(serviceId) ? PRINTING_FORMATS_LABEL : DEFAULT_FORMATS_LABEL
}

export function getGuestAcceptAttribute(serviceId?: string | null): string {
  return isPrintingService(serviceId) ? '.stl' : '.stp'
}

export function getIncompatibleModelMessage(serviceId?: string | null): string {
  return isPrintingService(serviceId)
    ? 'Для 3D-печати загрузите STL-файл.'
    : 'Для этого типа обработки загрузите STP-файл.'
}
