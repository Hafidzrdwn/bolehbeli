import { describe, expect, it } from 'vitest'
import { reformatInput } from '@/lib/rupiah-input'

describe('reformatInput edge cases', () => {
  it('returns empty result for empty or non-numeric input', () => {
    expect(reformatInput('', 0)).toEqual({
      value: null,
      text: '',
      caret: 0,
    })
    expect(reformatInput('abc', 3)).toEqual({
      value: null,
      text: '',
      caret: 0,
    })
  })

  it('clamps caret to 0 when caret is at beginning or before any digit', () => {
    const result = reformatInput('Rp 50.000', 1)
    expect(result.value).toBe(50000)
    expect(result.text).toBe('50.000')
    expect(result.caret).toBe(0)
  })
})

describe('reformatInput caret positioning', () => {
  it('handles typing digits at the end of input', () => {
    const result = reformatInput('1.5000', 6)
    expect(result).toEqual({
      value: 15000,
      text: '15.000',
      caret: 6,
    })
  })

  it('handles insertion in the middle while preserving caret position', () => {
    const result = reformatInput('1.2500', 3)
    expect(result.value).toBe(12500)
    expect(result.text).toBe('12.500')
    expect(result.caret).toBe(2)
  })

  it('handles deletion adjacent to a separator dot', () => {
    const result = reformatInput('1500', 1)
    expect(result.value).toBe(1500)
    expect(result.text).toBe('1.500')
    expect(result.caret).toBe(1)
  })

  it('handles pasting formatted rupiah string', () => {
    const raw = 'Rp 3.000.000'
    const result = reformatInput(raw, raw.length)
    expect(result.value).toBe(3000000)
    expect(result.text).toBe('3.000.000')
    expect(result.caret).toBe(9)
  })
})
