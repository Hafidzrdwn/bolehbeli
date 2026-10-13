import { describe, expect, it } from 'vitest'
import { sanitizeTitle } from '@/lib/sanitize'

describe('sanitizeTitle', () => {
  it('strips control characters', () => {
    const input = 'Beli\u0000 Kopi\u0007 Enak\u001F'
    expect(sanitizeTitle(input)).toBe('Beli Kopi Enak')
  })

  it('strips zero-width characters', () => {
    const input = 'Beli\u200B\u200C\u200D\uFEFFLaptop'
    expect(sanitizeTitle(input)).toBe('BeliLaptop')
  })

  it('strips bidirectional override characters', () => {
    const input = 'Beli\u202E\u2066Sepatu\u2069'
    expect(sanitizeTitle(input)).toBe('BeliSepatu')
  })

  it('normalizes multiple whitespaces and trims edges', () => {
    expect(sanitizeTitle('   a   b   ')).toBe('a b')
    expect(sanitizeTitle('\t\nBelanja   Bulanan\n\r')).toBe('Belanja Bulanan')
  })

  it('truncates title to a maximum of 60 characters', () => {
    const longTitle = 'a'.repeat(80)
    const sanitized = sanitizeTitle(longTitle)
    expect(sanitized.length).toBe(60)
    expect(sanitized).toBe('a'.repeat(60))
  })

  it('preserves HTML-like markup as literal string (no XSS sanitization here)', () => {
    expect(sanitizeTitle('<script>x</script>')).toBe('<script>x</script>')
  })

  it('returns empty string for inputs with only invisible characters or whitespace', () => {
    expect(sanitizeTitle('')).toBe('')
    expect(sanitizeTitle('   \t\n   ')).toBe('')
    expect(sanitizeTitle('\u200B\u200C\uFEFF')).toBe('')
    // @ts-expect-error test non-string input guard
    expect(sanitizeTitle(null)).toBe('')
  })
})
