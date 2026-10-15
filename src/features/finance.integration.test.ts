import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFinanceStore } from '@/stores/finance'
import { setupConsoleGuard } from '@/test/console-guard'

describe('Finance Store & Decision Integration', () => {
  setupConsoleGuard()

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('evaluates status danger on adding deficit wishlist, restores safe/idle on toggle off', () => {
    const store = useFinanceStore()
    store.setBalance(3_000_000)
    store.addNeed({ title: 'Kebutuhan Wajib', amount: 1_500_000 })
    store.state.targetDate = '2026-10-29'

    expect(store.decisionResult.hasSelection).toBe(false)
    expect(store.decisionResult.status).toBe('safe')
    expect(store.decisionResult.message.tone).toBe('idle')
    expect(store.decisionResult.message.headline).toBe('Pilih barang untuk disimulasikan')

    const addRes = store.addWishlistItem({ title: 'Barang Mahal', price: 1_600_000 })
    expect(addRes.ok).toBe(true)
    if (!addRes.ok) return

    expect(addRes.value.selected).toBe(true)
    expect(store.totalActiveWishlist).toBe(1_600_000)
    expect(store.decisionResult.status).toBe('danger')
    expect(store.decisionResult.message.tone).toBe('danger')
    expect(store.decisionResult.message.headline).toBe('Skip dulu!')

    store.toggleWishlistItem(addRes.value.id)

    expect(store.totalActiveWishlist).toBe(0)
    expect(store.decisionResult.hasSelection).toBe(false)
    expect(store.decisionResult.status).toBe('safe')
    expect(store.decisionResult.message.tone).toBe('idle')
    expect(store.decisionResult.message.headline).toBe('Pilih barang untuk disimulasikan')
  })
})
