import { beforeEach, describe, expect, it } from 'vitest'
import { createDefaultState } from '@/schemas/finance.schema'
import { financeSerializer, restoreState } from '@/schemas/persistence'

const FIXED_TODAY = '2026-10-14'

describe('restoreState corruption and envelope handling', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('backs up corrupted JSON to corrupt key and returns default state', () => {
    const invalidJson = '{ bad json...'
    const state = restoreState(invalidJson, FIXED_TODAY)

    expect(state).toEqual(createDefaultState(FIXED_TODAY))
    expect(localStorage.getItem('boleh-beli:state:corrupt')).toBe(invalidJson)
  })

  it('reads valid envelope v1 payload intact', () => {
    const payload = JSON.stringify({
      version: 1,
      data: {
        currentBalance: 5_000_000,
        targetDate: '2026-10-31',
        bufferThreshold: 400_000,
        minDailyBudget: 25_000,
        needs: [{ id: 'n1', title: 'Makan', amount: 50_000, category: 'food' }],
        wishlist: [{ id: 'w1', title: 'Buku', price: 100_000, selected: true }],
      },
    })

    const state = restoreState(payload, FIXED_TODAY)
    expect(state.currentBalance).toBe(5_000_000)
    expect(state.needs).toHaveLength(1)
    expect(state.wishlist).toHaveLength(1)
  })

  it('handles legacy v0 data without envelope and version 99 best-effort', () => {
    const v0Data = JSON.stringify({ currentBalance: 1_000_000 })
    const state0 = restoreState(v0Data, FIXED_TODAY)
    expect(state0.currentBalance).toBe(1_000_000)

    const v99Data = JSON.stringify({
      version: 99,
      data: { currentBalance: 2_000_000, unknownNewField: 'ignore me' },
    })
    const state99 = restoreState(v99Data, FIXED_TODAY)
    expect(state99.currentBalance).toBe(2_000_000)
  })
})

describe('restoreState items sanitization', () => {
  it('discards invalid items, floats, and duplicate ids while saving valid ones', () => {
    const payload = JSON.stringify({
      version: 1,
      data: {
        targetDate: '2026-13-45', // invalid date
        needs: [
          { id: 'dup', title: 'Valid 1', amount: 1000, category: 'zzz' }, // category fallback
          { id: 'dup', title: 'Dup id', amount: 2000, category: 'food' }, // duplicate id
          { id: 'bad1', title: '', amount: 1000, category: 'food' }, // empty title
          { id: 'bad2', title: 'Float', amount: 1500.5, category: 'food' }, // float
        ],
        wishlist: [
          { id: 'w1', title: '<img src=x onerror=alert(1)>', price: 5000, selected: true },
          { id: 'w2', title: 'Neg price', price: -1, selected: true },
        ],
      },
    })

    const state = restoreState(payload, FIXED_TODAY)
    expect(state.targetDate).toBe('2026-10-31') // reset to end of month default
    expect(state.needs).toHaveLength(1)
    expect(state.needs[0]?.category).toBe('other')
    expect(state.wishlist).toHaveLength(1)
    expect(state.wishlist[0]?.title).toBe('<img src=x onerror=alert(1)>')
  })
})

describe('restoreState bounds and serialization', () => {
  it('clamps arrays with over 500 items to MAX_ITEMS (50)', () => {
    const largeNeeds = Array.from({ length: 500 }, (_, i) => ({
      id: `id-${i}`,
      title: `Item ${i}`,
      amount: 10_000,
      category: 'food',
    }))

    const payload = JSON.stringify({ version: 1, data: { needs: largeNeeds } })
    const state = restoreState(payload, FIXED_TODAY)
    expect(state.needs).toHaveLength(50)
  })

  it('serializes and deserializes via financeSerializer', () => {
    const d = createDefaultState(FIXED_TODAY)
    d.currentBalance = 750_000

    const serialized = financeSerializer.write(d)
    expect(JSON.parse(serialized).version).toBe(1)

    const readState = financeSerializer.read(serialized)
    expect(readState.currentBalance).toBe(750_000)
  })
})
