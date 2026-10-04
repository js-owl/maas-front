import { describe, expect, it } from 'vitest'
import { parseFilesQueryToIds } from './parse-files'

describe('parseFilesQueryToIds', () => {
  it('returns an empty list for falsy input', () => {
    expect(parseFilesQueryToIds(null)).toEqual([])
    expect(parseFilesQueryToIds(undefined)).toEqual([])
    expect(parseFilesQueryToIds('')).toEqual([])
  })

  it('parses a JSON array of numbers or numeric strings', () => {
    expect(parseFilesQueryToIds('[1,2,3]')).toEqual([1, 2, 3])
    expect(parseFilesQueryToIds('["4","5"]')).toEqual([4, 5])
  })

  it('falls through when JSON is invalid or not an array', () => {
    // Broken JSON "[1,2" is split on commas → Number("[1") is NaN, Number("2") stays.
    expect(parseFilesQueryToIds('[1,2')).toEqual([2])
    expect(parseFilesQueryToIds('{"a":1}')).toEqual([])
  })

  it('splits comma-separated strings and arrays', () => {
    expect(parseFilesQueryToIds('10, 20, x, 30')).toEqual([10, 20, 30])
    expect(parseFilesQueryToIds(['1', '2,3'])).toEqual([1, 2, 3])
  })

  it('coerces a bare number', () => {
    expect(parseFilesQueryToIds(42)).toEqual([42])
  })
})
