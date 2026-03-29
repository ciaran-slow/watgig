import { describe, it, expect } from 'vitest'
import { getHeaderForFilter } from './eventHelpers'

describe('getHeaderForFilter', () => {
  it('returns "Featured Events" for "featured"', () => {
    expect(getHeaderForFilter('featured')).toBe('Featured Events')
  })

  it('returns "Rock / Indie" for "rock"', () => {
    expect(getHeaderForFilter('rock')).toBe('Rock / Indie')
  })

  it('returns "All Events" for an unknown filter', () => {
    expect(getHeaderForFilter('unknown')).toBe('All Events')
  })

  it('returns "All Events" for an empty string', () => {
    expect(getHeaderForFilter('')).toBe('All Events')
  })
})
