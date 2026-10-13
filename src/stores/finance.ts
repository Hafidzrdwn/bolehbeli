import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { useToday } from '@/composables/useToday'
import { STORAGE_KEY } from '@/lib/constants'
import { todayISO } from '@/lib/date'
import { createDefaultState } from '@/schemas/finance.schema'
import { financeSerializer } from '@/schemas/persistence'
import {
  createFinanceConfigActions,
  createFinanceGetters,
  createFinanceItemActions,
} from '@/stores/finance.helpers'
import type { FinanceState } from '@/types/finance'

export const useFinanceStore = defineStore('finance', () => {
  const today = useToday()
  const storage = typeof localStorage !== 'undefined' ? localStorage : undefined

  const state = useStorage<FinanceState>(
    STORAGE_KEY,
    createDefaultState(todayISO()),
    storage,
    {
      serializer: financeSerializer,
      writeDefaults: true,
      listenToStorageChanges: true,
      // eslint-disable-next-line no-console
      onError: (e) => console.warn('[storage]', e),
    },
  )

  const getters = createFinanceGetters(state, today)
  const configActions = createFinanceConfigActions(state)
  const itemActions = createFinanceItemActions(state)

  return {
    state,
    ...getters,
    ...configActions,
    ...itemActions,
  }
})
