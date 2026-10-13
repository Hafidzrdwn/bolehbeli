import { describe, expect, it } from 'vitest'
import { MAX_AMOUNT } from '@/lib/constants'
import { clampAmount, formatDigits, formatIDR, parseRupiah } from '@/lib/money'

describe('parseRupiah', () => {
  it('parses formatted rupiah and numbers correctly', () => {
    expect(parseRupiah('1.500.000')).toBe(1500000)
    expect(parseRupiah('0')).toBe(0)
    expect(parseRupiah('00012')).toBe(12)
    expect(parseRupiah(' 1 000 ')).toBe(1000)
    expect(parseRupiah('-5000')).toBe(5000)
  })

  it('strips Indonesian trailing decimal (,dd) before extracting digits', () => {
    expect(parseRupiah('Rp 2.500.000,50')).toBe(2500000)
    expect(parseRupiah('100.000,9')).toBe(100000)
  })

  it('returns null for empty or non-numeric inputs', () => {
    expect(parseRupiah('')).toBeNull()
    expect(parseRupiah('   ')).toBeNull()
    expect(parseRupiah('abc')).toBeNull()
    expect(parseRupiah('Rp ')).toBeNull()
  })

  it('clamps extremely large values to MAX_AMOUNT', () => {
    expect(parseRupiah('9'.repeat(20))).toBe(MAX_AMOUNT)
  })
})

describe('formatIDR', () => {
  it('formats positive integers to Indonesian Rupiah currency', () => {
    const formatted = formatIDR(1500000).replace(/\u00A0/g, ' ')
    expect(formatted).toBe('Rp 1.500.000')
  })

  it('handles negative numbers', () => {
    const formatted = formatIDR(-1500000).replace(/\u00A0/g, ' ')
    expect(formatted).toMatch(/^-Rp\s1\.500\.000$/)
  })

  it('handles zero and non-finite values', () => {
    const formattedZero = formatIDR(0).replace(/\u00A0/g, ' ')
    expect(formattedZero).toBe('Rp 0')
    const formattedNaN = formatIDR(Number.NaN).replace(/\u00A0/g, ' ')
    expect(formattedNaN).toBe('Rp 0')
  })
})

describe('formatDigits', () => {
  it('formats integers with thousand separators without currency symbol', () => {
    expect(formatDigits(1500000)).toBe('1.500.000')
    expect(formatDigits(0)).toBe('0')
    expect(formatDigits(-1500000)).toBe('-1.500.000')
  })
})

describe('clampAmount', () => {
  it('clamps values between 0 and MAX_AMOUNT', () => {
    expect(clampAmount(-100)).toBe(0)
    expect(clampAmount(0)).toBe(0)
    expect(clampAmount(100.99)).toBe(100)
    expect(clampAmount(100_000_000_000)).toBe(MAX_AMOUNT)
    expect(clampAmount(Number.NaN)).toBe(0)
  })
})
