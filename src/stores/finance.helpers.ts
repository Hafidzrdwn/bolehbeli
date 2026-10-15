import { computed, type Ref } from 'vue'
import { diffInDays, isValidISODate, todayISO } from '@/lib/date'
import { evaluateDecision } from '@/lib/finance/decision'
import { clampAmount } from '@/lib/money'
import { createDefaultState } from '@/schemas/finance.schema'
import type { FinanceState, Result } from '@/types/finance'

export * from './finance.items'

export function createFinanceGetters(state: Ref<FinanceState>, today: Ref<string>) {
  const isTargetPast = computed(() => diffInDays(today.value, state.value.targetDate) < 0)
  const daysRemaining = computed(() => Math.max(1, diffInDays(today.value, state.value.targetDate)))
  const totalNeeds = computed(() => state.value.needs.reduce((acc, it) => acc + it.amount, 0))
  const totalActiveWishlist = computed(() =>
    state.value.wishlist.reduce((acc, it) => (it.selected ? acc + it.price : acc), 0),
  )
  const selectedCount = computed(() => state.value.wishlist.filter((it) => it.selected).length)

  const decisionResult = computed(() =>
    evaluateDecision({
      balance: state.value.currentBalance,
      needsTotal: totalNeeds.value,
      wishlistTotal: totalActiveWishlist.value,
      daysRemaining: daysRemaining.value,
      bufferThreshold: state.value.bufferThreshold,
      minDailyBudget: state.value.minDailyBudget,
    }),
  )

  return {
    isTargetPast,
    daysRemaining,
    totalNeeds,
    totalActiveWishlist,
    selectedCount,
    decisionResult,
    buffer: computed(() => decisionResult.value.buffer),
    baselineDailyBudget: computed(() => decisionResult.value.daily0),
    projectedDailyBudget: computed(() => decisionResult.value.dailyFinal),
  }
}

export function createFinanceConfigActions(state: Ref<FinanceState>) {
  function setBalance(amount: number): Result<number> {
    const val = clampAmount(amount)
    state.value.currentBalance = val
    return { ok: true, value: val }
  }

  function setTargetDate(iso: string): Result<string> {
    if (!isValidISODate(iso)) return { ok: false, error: 'AMOUNT_INVALID' }
    state.value.targetDate = iso
    return { ok: true, value: iso }
  }

  function setBufferThreshold(threshold: number | null): Result<number | null> {
    const val = threshold === null ? null : clampAmount(threshold)
    state.value.bufferThreshold = val
    return { ok: true, value: val }
  }

  function setMinDailyBudget(amount: number): Result<number> {
    const val = clampAmount(amount)
    state.value.minDailyBudget = val
    return { ok: true, value: val }
  }

  function resetAll(): void {
    state.value = createDefaultState(todayISO())
  }

  return { setBalance, setTargetDate, setBufferThreshold, setMinDailyBudget, resetAll }
}
