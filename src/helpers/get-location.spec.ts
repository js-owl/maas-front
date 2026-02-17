import { describe, it, expect } from 'vitest'
import { locations } from '@/helpers/get-location'

describe('get-location', () => {
  it('exports locations array with expected length', () => {
    expect(locations).toBeDefined()
    expect(Array.isArray(locations)).toBe(true)
    expect(locations.length).toBe(5)
  })

  it('each location has company and location keys', () => {
    for (const item of locations) {
      expect(item).toHaveProperty('company')
      expect(item).toHaveProperty('location')
      expect(typeof item.company).toBe('string')
      expect(typeof item.location).toBe('string')
    }
  })

  it('contains expected companies', () => {
    const companies = locations.map((l) => l.company)
    expect(companies).toContain('AODMZ')
    expect(companies).toContain('Kronshtadt')
    expect(companies).toContain('ecolibriaero_legal')
  })
})
