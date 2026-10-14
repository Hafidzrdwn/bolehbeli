import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFinanceStore } from '@/stores/finance'

describe('Settings: buffer and min daily config', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('toggles bufferThreshold between automatic and manual override', () => {
    const store = useFinanceStore()
    store.setBalance(2_000_000)

    expect(store.state.bufferThreshold).toBeNull()
    expect(store.buffer).toBe(200_000)

    store.setBufferThreshold(500_000)
    expect(store.state.bufferThreshold).toBe(500_000)
    expect(store.buffer).toBe(500_000)

    store.setBufferThreshold(null)
    expect(store.state.bufferThreshold).toBeNull()
    expect(store.buffer).toBe(200_000)
  })

  it('updates minDailyBudget setting', () => {
    const store = useFinanceStore()
    store.setMinDailyBudget(20_000)
    expect(store.state.minDailyBudget).toBe(20_000)

    store.setMinDailyBudget(50_000)
    expect(store.state.minDailyBudget).toBe(50_000)
  })
})

describe('Settings: reset all state', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('resets entire state cleanly on resetAll', () => {
    const store = useFinanceStore()
    store.setBalance(5_000_000)
    store.addNeed({ title: 'Sewa', amount: 1_000_000 })
    store.addWishlistItem({ title: 'Gadget', price: 2_000_000 })
    store.setBufferThreshold(300_000)

    store.resetAll()

    expect(store.state.currentBalance).toBe(0)
    expect(store.state.needs).toEqual([])
    expect(store.state.wishlist).toEqual([])
    expect(store.state.bufferThreshold).toBeNull()
  })
})
