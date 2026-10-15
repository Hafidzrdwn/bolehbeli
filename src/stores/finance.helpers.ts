import { computed, type Ref } from 'vue'
import { MAX_AMOUNT, MAX_ITEMS } from '@/lib/constants'
import { diffInDays, isValidISODate, todayISO } from '@/lib/date'
import { evaluateDecision } from '@/lib/finance/decision'
import { createId } from '@/lib/id'
import { clampAmount } from '@/lib/money'
import { sanitizeTitle } from '@/lib/sanitize'
import { createDefaultState } from '@/schemas/finance.schema'
import type {
  ExpenseCategory,
  ExpenseItem,
  FinanceState,
  Result,
  WishlistItem,
} from '@/types/finance'

export interface CreateNeedInput {
  title: string
  amount: number
  category?: ExpenseCategory
}

export interface CreateWishlistInput {
  title: string
  price: number
}

export function validateAndCreateNeed(
  input: CreateNeedInput,
  currentCount: number,
): Result<ExpenseItem> {
  if (currentCount >= MAX_ITEMS) return { ok: false, error: 'LIMIT_REACHED' }
  const title = sanitizeTitle(input.title)
  if (!title) return { ok: false, error: 'TITLE_EMPTY' }
  const amount = Math.floor(input.amount)
  if (!Number.isFinite(amount) || amount < 1 || amount > MAX_AMOUNT) {
    return { ok: false, error: 'AMOUNT_INVALID' }
  }
  return {
    ok: true,
    value: { id: createId(), title, amount, category: input.category ?? 'other' },
  }
}

export function validateAndCreateWishlist(
  input: CreateWishlistInput,
  currentCount: number,
): Result<WishlistItem> {
  if (currentCount >= MAX_ITEMS) return { ok: false, error: 'LIMIT_REACHED' }
  const title = sanitizeTitle(input.title)
  if (!title) return { ok: false, error: 'TITLE_EMPTY' }
  const price = Math.floor(input.price)
  if (!Number.isFinite(price) || price < 1 || price > MAX_AMOUNT) {
    return { ok: false, error: 'AMOUNT_INVALID' }
  }
  return {
    ok: true,
    value: { id: createId(), title, price, selected: true },
  }
}

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

export function createFinanceItemActions(state: Ref<FinanceState>) {
  function addNeed(input: CreateNeedInput): Result<ExpenseItem> {
    const res = validateAndCreateNeed(input, state.value.needs.length)
    if (!res.ok) return res
    state.value.needs.push(res.value)
    return res
  }
  function removeNeed(id: string): Result<boolean> {
    state.value.needs = state.value.needs.filter((it) => it.id !== id)
    return { ok: true, value: true }
  }
  function addWishlistItem(input: CreateWishlistInput): Result<WishlistItem> {
    const res = validateAndCreateWishlist(input, state.value.wishlist.length)
    if (!res.ok) return res
    state.value.wishlist.push(res.value)
    return res
  }
  function removeWishlistItem(id: string): Result<boolean> {
    state.value.wishlist = state.value.wishlist.filter((it) => it.id !== id)
    return { ok: true, value: true }
  }
  function toggleWishlistItem(id: string): Result<boolean> {
    const item = state.value.wishlist.find((it) => it.id === id)
    if (!item) return { ok: false, error: 'AMOUNT_INVALID' }
    item.selected = !item.selected
    return { ok: true, value: item.selected }
  }
  return { addNeed, removeNeed, addWishlistItem, removeWishlistItem, toggleWishlistItem }
}
