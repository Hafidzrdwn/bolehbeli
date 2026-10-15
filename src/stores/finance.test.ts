import { nextTick } from 'vue'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { STORAGE_KEY } from '@/lib/constants'
import { useFinanceStore } from '@/stores/finance'

describe('useFinanceStore CRUD and actions', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('handles addNeed success and validation error codes', () => {
    const store = useFinanceStore()

    const okRes = store.addNeed({ title: 'Kopi', amount: 25_000, category: 'food' })
    expect(okRes.ok).toBe(true)
    expect(store.totalNeeds).toBe(25_000)

    const emptyRes = store.addNeed({ title: '   ', amount: 10_000 })
    expect(emptyRes).toEqual({ ok: false, error: 'TITLE_EMPTY' })

    const invalidRes = store.addNeed({ title: 'Gula', amount: -500 })
    expect(invalidRes).toEqual({ ok: false, error: 'AMOUNT_INVALID' })
  })

  it('handles toggleWishlistItem and removes items', () => {
    const store = useFinanceStore()
    const addRes = store.addWishlistItem({ title: 'Headset', price: 300_000 })
    expect(addRes.ok).toBe(true)

    if (addRes.ok) {
      expect(addRes.value.selected).toBe(true)
      expect(store.totalActiveWishlist).toBe(300_000)
      store.toggleWishlistItem(addRes.value.id)
      expect(store.totalActiveWishlist).toBe(0)
      store.toggleWishlistItem(addRes.value.id)
      expect(store.totalActiveWishlist).toBe(300_000)

      store.removeWishlistItem(addRes.value.id)
      expect(store.state.wishlist).toHaveLength(0)
    }
  })

  it('resets state completely on resetAll', () => {
    const store = useFinanceStore()
    store.setBalance(1_000_000)
    store.addNeed({ title: 'Listrik', amount: 200_000 })
    expect(store.state.currentBalance).toBe(1_000_000)

    store.resetAll()
    expect(store.state.currentBalance).toBe(0)
    expect(store.state.needs).toHaveLength(0)
  })
})

describe('useFinanceStore persistence and rehydration', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('writes envelope to localStorage and rehydrates in a new store instance', async () => {
    const store1 = useFinanceStore()
    store1.setBalance(2_500_000)
    store1.addNeed({ title: 'Internet', amount: 350_000 })
    await nextTick()

    const rawStored = localStorage.getItem(STORAGE_KEY)
    expect(rawStored).toBeTruthy()
    const parsed = JSON.parse(rawStored!)
    expect(parsed.version).toBe(1)
    expect(parsed.data.currentBalance).toBe(2_500_000)

    // Rehydrate in fresh pinia instance
    setActivePinia(createPinia())
    const store2 = useFinanceStore()
    expect(store2.state.currentBalance).toBe(2_500_000)
    expect(store2.state.needs).toHaveLength(1)
  })
})

describe('useFinanceStore getters and date validation', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('clamps balance and rejects invalid target date', () => {
    const store = useFinanceStore()
    store.setBalance(-50_000)
    expect(store.state.currentBalance).toBe(0)

    const invalidDateRes = store.setTargetDate('invalid-iso')
    expect(invalidDateRes).toEqual({ ok: false, error: 'AMOUNT_INVALID' })

    const validDateRes = store.setTargetDate('2026-11-30')
    expect(validDateRes.ok).toBe(true)
  })

  it('evaluates isTargetPast and daysRemaining correctly', () => {
    const store = useFinanceStore()
    store.setTargetDate('2020-01-01')
    expect(store.isTargetPast).toBe(true)
    expect(store.daysRemaining).toBe(1) // clamped to >= 1
  })
})
