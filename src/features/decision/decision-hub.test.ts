import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { buildAllocation } from '@/lib/finance/allocation'
import { useFinanceStore } from '@/stores/finance'

describe('DecisionHub: Golden Vectors A-C', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('evaluates Vector A: tanpa pilihan (safe)', () => {
    const store = useFinanceStore()
    store.setBalance(3_000_000)
    store.addNeed({ title: 'Kebutuhan Pokok', amount: 1_500_000 })
    store.state.targetDate = '2026-10-29'

    const res = store.decisionResult
    expect(res.status).toBe('safe')
    expect(res.buffer).toBe(300_000)
    expect(res.hasSelection).toBe(false)
  })

  it('evaluates Vector B: batas 40% persis (safe)', () => {
    const store = useFinanceStore()
    store.setBalance(3_000_000)
    store.addNeed({ title: 'Kebutuhan', amount: 1_500_000 })
    const addRes = store.addWishlistItem({ title: 'Barang B', price: 600_000 })
    if (addRes.ok) store.toggleWishlistItem(addRes.value.id)

    const res = store.decisionResult
    expect(res.status).toBe('safe')
    expect(res.sisaFinal).toBe(900_000)
    expect(res.reasons).toEqual([])
  })

  it('evaluates Vector C: turun > 40% (warning)', () => {
    const store = useFinanceStore()
    store.setBalance(3_000_000)
    store.addNeed({ title: 'Kebutuhan', amount: 1_500_000 })
    const addRes = store.addWishlistItem({ title: 'Barang C', price: 700_000 })
    if (addRes.ok) store.toggleWishlistItem(addRes.value.id)

    const res = store.decisionResult
    expect(res.status).toBe('warning')
    expect(res.sisaFinal).toBe(800_000)
    expect(res.reasons).toContain('daily_drop_exceeded')
  })
})

describe('DecisionHub: Golden Vectors D-E', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('evaluates Vector D: di bawah buffer (warning)', () => {
    const store = useFinanceStore()
    store.setBalance(3_000_000)
    store.addNeed({ title: 'Kebutuhan', amount: 1_500_000 })
    const addRes = store.addWishlistItem({ title: 'Barang D', price: 1_300_000 })
    if (addRes.ok) store.toggleWishlistItem(addRes.value.id)

    const res = store.decisionResult
    expect(res.status).toBe('warning')
    expect(res.sisaFinal).toBe(200_000)
    expect(res.reasons).toEqual(
      expect.arrayContaining(['below_buffer', 'below_min_daily', 'daily_drop_exceeded']),
    )
  })

  it('evaluates Vector E: defisit (danger)', () => {
    const store = useFinanceStore()
    store.setBalance(3_000_000)
    store.addNeed({ title: 'Kebutuhan', amount: 1_500_000 })
    const addRes = store.addWishlistItem({ title: 'Barang E', price: 1_600_000 })
    if (addRes.ok) store.toggleWishlistItem(addRes.value.id)

    const res = store.decisionResult
    expect(res.status).toBe('danger')
    expect(res.sisaFinal).toBe(-100_000)
    expect(res.shortfall).toBe(100_000)
    expect(res.reasons).toEqual(['deficit'])

    const allocation = buildAllocation({
      balance: store.state.currentBalance,
      needsTotal: store.totalNeeds,
      wishlistTotal: store.totalActiveWishlist,
      buffer: res.buffer,
    })
    expect(allocation.deficit).toBe(true)
    expect(allocation.shortfall).toBe(100_000)
  })
})
