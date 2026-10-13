import { describe, expect, it } from 'vitest'
import { buildAllocation } from './allocation'

describe('buildAllocation sufficient and exact conditions', () => {
  it('calculates allocation correctly when balance is sufficient', () => {
    const res = buildAllocation({
      balance: 1_000_000,
      needsTotal: 400_000,
      wishlistTotal: 200_000,
      buffer: 100_000,
    })

    expect(res.needsPct).toBe(40)
    expect(res.wishlistPct).toBe(20)
    expect(res.remainingPct).toBe(40)
    expect(res.bufferMarkerPct).toBe(90)
    expect(res.deficit).toBe(false)
    expect(res.shortfall).toBe(0)
  })

  it('calculates allocation correctly when money is exact (tepat habis)', () => {
    const res = buildAllocation({
      balance: 1_000_000,
      needsTotal: 600_000,
      wishlistTotal: 400_000,
      buffer: 100_000,
    })

    expect(res.needsPct).toBe(60)
    expect(res.wishlistPct).toBe(40)
    expect(res.remainingPct).toBe(0)
    expect(res.bufferMarkerPct).toBe(90)
    expect(res.deficit).toBe(false)
    expect(res.shortfall).toBe(0)
  })
})

describe('buildAllocation deficit and edge cases', () => {
  it('calculates allocation correctly during deficit', () => {
    const res = buildAllocation({
      balance: 500_000,
      needsTotal: 400_000,
      wishlistTotal: 300_000,
      buffer: 50_000,
    })

    expect(res.deficit).toBe(true)
    expect(res.shortfall).toBe(200_000)
    expect(res.needsPct + res.wishlistPct).toBeLessThanOrEqual(100)
    expect(res.remainingPct).toBe(0)
  })

  it('handles zero balance safely without division by zero', () => {
    const res = buildAllocation({
      balance: 0,
      needsTotal: 0,
      wishlistTotal: 0,
      buffer: 50_000,
    })

    expect(res.needsPct).toBe(0)
    expect(res.wishlistPct).toBe(0)
    expect(res.remainingPct).toBe(100)
    expect(res.bufferMarkerPct).toBe(0)
    expect(res.deficit).toBe(false)
    expect(res.shortfall).toBe(0)
  })

  it('handles buffer greater than balance', () => {
    const res = buildAllocation({
      balance: 500_000,
      needsTotal: 200_000,
      wishlistTotal: 100_000,
      buffer: 600_000,
    })

    expect(res.bufferMarkerPct).toBe(0)
    expect(res.deficit).toBe(false)
    expect(res.remainingPct).toBe(40)
  })
})
