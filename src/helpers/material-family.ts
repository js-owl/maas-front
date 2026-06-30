export type BackendMaterialWithFamily = {
  id: string
  label: string
  family?: string | null
}

export type MaterialOption = { value: string; label: string }
export type MaterialOptionGroup = { label: string; options: MaterialOption[] }

export const getMaterialFamilyRuLabel = (rawFamily: string) => {
  const key = rawFamily.trim().toLowerCase()

  const dictionary: Record<string, string> = {
    steel: 'Сталь',
    stainless: 'Нержавеющая сталь',
    'stainless steel': 'Нержавеющая сталь',
    alum: 'Алюминий',
    aluminium: 'Алюминий',
    titanium: 'Титан',
    copper: 'Медь',
    latun: 'Латунь',
    bronze: 'Бронза',
    plastic: 'Пластики',
    plastics: 'Пластики',
    glass: 'Стекло',
    composite: 'Композиты',
    'pre-preg': 'Препрег',
    other: 'Другое',
  }

  return dictionary[key] ?? rawFamily
}

// Electroplating families use backend ids like "stainless_steel"; map them to UI labels.
export const getElectroplatingFamilyRuLabel = (rawFamily: string) => {
  const key = rawFamily.trim().toLowerCase()

  const dictionary: Record<string, string> = {
    aluminum: 'Алюминий',
    copper: 'Медь',
    stainless_steel: 'Нержавеющая сталь',
    carbon_steel: 'Углеродистая сталь',
    brass: 'Латунь',
    bronze: 'Бронза',
    titanium: 'Титан',
    zinc: 'Цинк',
  }

  return dictionary[key] ?? getMaterialFamilyRuLabel(key.replace(/_/g, ' '))
}

type BackendElectroplatingMaterial = {
  electroplating_family?: string | null
}

// Derive unique electroplating family options from legacy /materials response.
export const toElectroplatingFamilyOptions = (
  materials: BackendElectroplatingMaterial[],
  locale = 'ru'
): MaterialOption[] => {
  const seen = new Set<string>()

  return materials
    .map((item) => (item.electroplating_family ?? '').trim())
    .filter((family) => {
      if (!family || seen.has(family)) return false
      seen.add(family)
      return true
    })
    .map((family) => ({
      value: family,
      label: getElectroplatingFamilyRuLabel(family),
    }))
    .sort((a, b) => a.label.localeCompare(b.label, locale))
}

export const toMaterialOptionGroupsByFamily = (
  materials: BackendMaterialWithFamily[],
  opts?: { emptyFamilyLabel?: string; locale?: string }
): MaterialOptionGroup[] => {
  const emptyFamilyLabel = opts?.emptyFamilyLabel ?? 'Без группы'
  const locale = opts?.locale ?? 'ru'

  const groups = new Map<string, MaterialOption[]>()

  for (const item of materials) {
    const backendFamily = (item.family ?? '').trim()
    const label = backendFamily ? getMaterialFamilyRuLabel(backendFamily) : emptyFamilyLabel
    const arr = groups.get(label) ?? []
    arr.push({ value: item.id, label: item.label })
    groups.set(label, arr)
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b, locale))
    .map(([label, options]) => ({
      label,
      options: options.sort((a, b) => a.label.localeCompare(b.label, locale)),
    }))
}

