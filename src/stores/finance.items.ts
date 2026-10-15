import type { Ref } from 'vue'
import type { FinanceState } from '@/types/finance'
import { createNeedActions } from './finance.needs'
import { createWishlistActions } from './finance.wishlist'

export * from './finance.needs'
export * from './finance.wishlist'

export function createFinanceItemActions(state: Ref<FinanceState>) {
  const needActions = createNeedActions(state)
  const wishlistActions = createWishlistActions(state)

  return {
    ...needActions,
    ...wishlistActions,
  }
}
