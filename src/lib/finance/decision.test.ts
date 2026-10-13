import { describe, expect, it } from 'vitest'
import { evaluateDecision } from '@/lib/finance/decision'

function runCase(s: number, k: number, b: number, h: number, buf: number | null = null) {
  return evaluateDecision({
    balance: s,
    needsTotal: k,
    wishlistTotal: b,
    daysRemaining: h,
    bufferThreshold: buf,
    minDailyBudget: 20_000,
  })
}

describe('Golden vectors A - D', () => {
  it('passes Case A: safe without wishlist selection', () => {
    const res = runCase(3_000_000, 1_500_000, 0, 15)
    expect(res.status).toBe('safe')
    expect(res.reasons).toEqual([])
    expect(res.sisaFinal).toBe(1_500_000)
    expect(res.dailyFinal).toBe(100_000)
    expect(res.buffer).toBe(300_000)
  })

  it('passes Case B: exact 40% drop boundary is safe', () => {
    const res = runCase(3_000_000, 1_500_000, 600_000, 15)
    expect(res.status).toBe('safe')
    expect(res.reasons).toEqual([])
    expect(res.sisaFinal).toBe(900_000)
    expect(res.dailyFinal).toBe(60_000)
    expect(res.buffer).toBe(300_000)
    expect(res.equivalentDays).toBe(6)
  })

  it('passes Case C: drop > 40% triggers warning', () => {
    const res = runCase(3_000_000, 1_500_000, 700_000, 15)
    expect(res.status).toBe('warning')
    expect(res.reasons).toEqual(['daily_drop_exceeded'])
    expect(res.sisaFinal).toBe(800_000)
    expect(res.dailyFinal).toBe(53_333)
    expect(res.buffer).toBe(300_000)
  })

  it('passes Case D: below buffer, min daily, and drop exceeded', () => {
    const res = runCase(3_000_000, 1_500_000, 1_300_000, 15)
    expect(res.status).toBe('warning')
    expect(res.reasons).toEqual(['below_buffer', 'below_min_daily', 'daily_drop_exceeded'])
    expect(res.sisaFinal).toBe(200_000)
    expect(res.dailyFinal).toBe(13_333)
    expect(res.buffer).toBe(300_000)
  })
})

describe('Golden vectors E - H', () => {
  it('passes Case E: deficit from wishlist triggers danger', () => {
    const res = runCase(3_000_000, 1_500_000, 1_600_000, 15)
    expect(res.status).toBe('danger')
    expect(res.reasons).toEqual(['deficit'])
    expect(res.sisaFinal).toBe(-100_000)
    expect(res.dailyFinal).toBe(-6_667)
    expect(res.buffer).toBe(300_000)
  })

  it('passes Case F: baseline needs exceed balance triggers danger', () => {
    const res = runCase(500_000, 800_000, 0, 10)
    expect(res.status).toBe('danger')
    expect(res.reasons).toEqual(['deficit'])
    expect(res.sisaFinal).toBe(-300_000)
    expect(res.dailyFinal).toBe(-30_000)
    expect(res.buffer).toBe(50_000)
  })

  it('passes Case G: zero balance triggers warning with minimum buffer', () => {
    const res = runCase(0, 0, 0, 5)
    expect(res.status).toBe('warning')
    expect(res.reasons).toEqual(['below_buffer', 'below_min_daily'])
    expect(res.sisaFinal).toBe(0)
    expect(res.dailyFinal).toBe(0)
    expect(res.buffer).toBe(50_000)
  })

  it('passes Case H: manual buffer override is respected', () => {
    const res = runCase(3_000_000, 1_500_000, 0, 15, 2_000_000)
    expect(res.status).toBe('warning')
    expect(res.reasons).toEqual(['below_buffer'])
    expect(res.sisaFinal).toBe(1_500_000)
    expect(res.dailyFinal).toBe(100_000)
    expect(res.buffer).toBe(2_000_000)
  })
})

describe('Edge cases and invariant properties', () => {
  it('clamps past target date daysRemaining to 1 and avoids division by zero', () => {
    const res = runCase(100_000, 0, 0, -5)
    expect(res.daysRemaining).toBe(1)
    expect(res.dailyFinal).toBe(100_000)
  })

  it('does not trigger daily_drop_exceeded when daily0 <= 0', () => {
    const res = runCase(100_000, 100_000, 50_000, 5)
    expect(res.reasons).not.toContain('daily_drop_exceeded')
  })

  it('maintains invariants for 200 pseudo-random iterations', () => {
    let seed = 42
    for (let i = 0; i < 200; i++) {
      seed = ((seed * 1664525 + 1013904223) >>> 0)
      const s = seed % 10_000_000
      const k = Math.floor(seed / 16) % 5_000_000
      const b = Math.floor(seed / 256) % 5_000_000
      const h = (Math.floor(seed / 4096) % 30) + 1
      const res = runCase(s, k, b, h)

      expect(res.dailyFinal).toBeLessThanOrEqual(res.daily0)
      expect(res.sisaFinal).toBe(res.sisa0 - b)
    }
  })
})
