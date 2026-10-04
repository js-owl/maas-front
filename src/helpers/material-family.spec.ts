import { describe, expect, it } from 'vitest'
import {
  getElectroplatingFamilyRuLabel,
  getMaterialFamilyRuLabel,
  toElectroplatingFamilyOptions,
  toMaterialOptionGroupsByFamily,
} from './material-family'

describe('getMaterialFamilyRuLabel', () => {
  it('maps known English keys to Russian labels', () => {
    expect(getMaterialFamilyRuLabel('steel')).toBe('Сталь')
    expect(getMaterialFamilyRuLabel(' Stainless Steel ')).toBe('Нержавеющая сталь')
    expect(getMaterialFamilyRuLabel('alum')).toBe('Алюминий')
  })

  it('returns the original string for unknown families', () => {
    expect(getMaterialFamilyRuLabel('Инконель')).toBe('Инконель')
  })
})

describe('getElectroplatingFamilyRuLabel', () => {
  it('maps backend snake_case ids', () => {
    expect(getElectroplatingFamilyRuLabel('stainless_steel')).toBe('Нержавеющая сталь')
    expect(getElectroplatingFamilyRuLabel('carbon_steel')).toBe('Углеродистая сталь')
  })

  it('falls back through the material dictionary after replacing underscores', () => {
    // Dictionary key is "pre-preg"; underscore → space does not match, so raw string is kept.
    expect(getElectroplatingFamilyRuLabel('pre_preg')).toBe('pre preg')
    expect(getElectroplatingFamilyRuLabel('aluminum')).toBe('Алюминий')
  })
})

describe('toElectroplatingFamilyOptions', () => {
  it('deduplicates, labels and sorts families', () => {
    const options = toElectroplatingFamilyOptions([
      { electroplating_family: 'zinc' },
      { electroplating_family: 'aluminum' },
      { electroplating_family: 'zinc' },
      { electroplating_family: '  ' },
      { electroplating_family: null },
    ])
    expect(options.map((item) => item.value)).toEqual(['aluminum', 'zinc'])
    expect(options[0].label).toBe('Алюминий')
  })
})

describe('toMaterialOptionGroupsByFamily', () => {
  it('groups materials and sorts groups and options', () => {
    const groups = toMaterialOptionGroupsByFamily([
      { id: '2', label: 'Сталь 45', family: 'steel' },
      { id: '1', label: 'Д16Т', family: 'aluminum' },
      { id: '3', label: 'Без семейства', family: null },
      { id: '4', label: 'АМг6', family: 'aluminum' },
    ])

    expect(groups.map((group) => group.label)).toEqual(['Алюминий', 'Без группы', 'Сталь'])
    expect(groups[0].options.map((option) => option.label)).toEqual(['АМг6', 'Д16Т'])
  })

  it('allows a custom empty-family label', () => {
    const groups = toMaterialOptionGroupsByFamily(
      [{ id: '1', label: 'X', family: '' }],
      { emptyFamilyLabel: 'Прочее' }
    )
    expect(groups[0].label).toBe('Прочее')
  })
})
