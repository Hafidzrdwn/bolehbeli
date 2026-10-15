import type { Ref } from 'vue'
import { MAX_AMOUNT, MAX_ITEMS } from '@/lib/constants'
import { createId } from '@/lib/id'
import { sanitizeTitle } from '@/lib/sanitize'
import type { FinanceState, Result, WishlistItem } from '@/types/finance'
import type { RemovedItem } from './finance.needs'

export interface CreateWishlistInput {
  title: string
  price: number
}

export interface UpdateWishlistInput {
  title?: string
  price?: number
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

function applyWishlistPatch(item: WishlistItem, patch: UpdateWishlistInput): Result<WishlistItem> {
  if (patch.title !== undefined) {
    const sanitized = sanitizeTitle(patch.title)
    if (!sanitized) return { ok: false, error: 'TITLE_EMPTY' }
    item.title = sanitized
  }
  if (patch.price !== undefined) {
    const price = Math.floor(patch.price)
    if (!Number.isFinite(price) || price < 1 || price > MAX_AMOUNT) {
      return { ok: false, error: 'AMOUNT_INVALID' }
    }
    item.price = price
  }
  return { ok: true, value: item }
}

function createWishlistCrudActions(state: Ref<FinanceState>) {
  function addWishlistItem(input: CreateWishlistInput): Result<WishlistItem> {
    const res = validateAndCreateWishlist(input, state.value.wishlist.length)
    if (!res.ok) return res
    state.value.wishlist.push(res.value)
    return res
  }

  function updateWishlistItem(id: string, patch: UpdateWishlistInput): Result<WishlistItem> {
    const item = state.value.wishlist.find((it) => it.id === id)
    if (!item) return { ok: false, error: 'AMOUNT_INVALID' }
    return applyWishlistPatch(item, patch)
  }

  function removeWishlistItem(id: string): Result<RemovedItem<WishlistItem>> {
    const index = state.value.wishlist.findIndex((it) => it.id === id)
    const item = state.value.wishlist[index]
    if (index === -1 || !item) return { ok: false, error: 'AMOUNT_INVALID' }
    state.value.wishlist.splice(index, 1)
    return { ok: true, value: { item, index } }
  }

  function restoreWishlistItem(item: WishlistItem, index: number): Result<WishlistItem> {
    if (state.value.wishlist.length >= MAX_ITEMS) return { ok: false, error: 'LIMIT_REACHED' }
    const targetIdx = Math.max(0, Math.min(index, state.value.wishlist.length))
    state.value.wishlist.splice(targetIdx, 0, item)
    return { ok: true, value: item }
  }

  return { addWishlistItem, updateWishlistItem, removeWishlistItem, restoreWishlistItem }
}

function createWishlistSelectionActions(state: Ref<FinanceState>) {
  function toggleWishlistItem(id: string): Result<boolean> {
    const item = state.value.wishlist.find((it) => it.id === id)
    if (!item) return { ok: false, error: 'AMOUNT_INVALID' }
    item.selected = !item.selected
    return { ok: true, value: item.selected }
  }

  function setAllWishlistSelected(selected: boolean): void {
    state.value.wishlist.forEach((it) => {
      it.selected = selected
    })
  }

  return { toggleWishlistItem, setAllWishlistSelected }
}

export function createWishlistActions(state: Ref<FinanceState>) {
  return {
    ...createWishlistCrudActions(state),
    ...createWishlistSelectionActions(state),
  }
}
