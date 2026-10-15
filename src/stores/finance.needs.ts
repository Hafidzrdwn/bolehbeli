import type { Ref } from 'vue'
import { MAX_AMOUNT, MAX_ITEMS } from '@/lib/constants'
import { createId } from '@/lib/id'
import { sanitizeTitle } from '@/lib/sanitize'
import type { ExpenseCategory, ExpenseItem, FinanceState, Result } from '@/types/finance'

export interface CreateNeedInput {
  title: string
  amount: number
  category?: ExpenseCategory
}

export interface UpdateNeedInput {
  title?: string
  amount?: number
  category?: ExpenseCategory
}

export interface RemovedItem<T> {
  item: T
  index: number
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

export function createNeedActions(state: Ref<FinanceState>) {
  function addNeed(input: CreateNeedInput): Result<ExpenseItem> {
    const res = validateAndCreateNeed(input, state.value.needs.length)
    if (!res.ok) return res
    state.value.needs.push(res.value)
    return res
  }

  function updateNeed(id: string, patch: UpdateNeedInput): Result<ExpenseItem> {
    const item = state.value.needs.find((it) => it.id === id)
    if (!item) return { ok: false, error: 'AMOUNT_INVALID' }
    if (patch.title !== undefined) {
      const sanitized = sanitizeTitle(patch.title)
      if (!sanitized) return { ok: false, error: 'TITLE_EMPTY' }
      item.title = sanitized
    }
    if (patch.amount !== undefined) {
      const amount = Math.floor(patch.amount)
      if (!Number.isFinite(amount) || amount < 1 || amount > MAX_AMOUNT) {
        return { ok: false, error: 'AMOUNT_INVALID' }
      }
      item.amount = amount
    }
    if (patch.category !== undefined) item.category = patch.category
    return { ok: true, value: item }
  }

  function removeNeed(id: string): Result<RemovedItem<ExpenseItem>> {
    const index = state.value.needs.findIndex((it) => it.id === id)
    const item = state.value.needs[index]
    if (index === -1 || !item) return { ok: false, error: 'AMOUNT_INVALID' }
    state.value.needs.splice(index, 1)
    return { ok: true, value: { item, index } }
  }

  function restoreNeed(item: ExpenseItem, index: number): Result<ExpenseItem> {
    if (state.value.needs.length >= MAX_ITEMS) return { ok: false, error: 'LIMIT_REACHED' }
    const targetIdx = Math.max(0, Math.min(index, state.value.needs.length))
    state.value.needs.splice(targetIdx, 0, item)
    return { ok: true, value: item }
  }

  return { addNeed, updateNeed, removeNeed, restoreNeed }
}
