import { nextTick, ref } from 'vue'
import type { Result, ValidationError } from '@/types/finance'

export const ERROR_MESSAGES: Record<ValidationError, string> = {
  TITLE_EMPTY: 'Isi nama dulu',
  AMOUNT_INVALID: 'Nominal harus lebih dari 0',
  LIMIT_REACHED: 'Maksimal 50 item',
}

export interface ItemFormSubmitData {
  title: string
  amount: number
}

export function useItemForm<T>(
  onSubmit: (data: ItemFormSubmitData) => Result<T>,
  onSuccess?: () => void,
) {
  const title = ref('')
  const amount = ref<number | null>(null)
  const error = ref<string | null>(null)

  function submit(): Result<T> {
    error.value = null
    const res = onSubmit({
      title: title.value,
      amount: amount.value ?? 0,
    })

    if (!res.ok) {
      error.value = ERROR_MESSAGES[res.error]
      return res
    }

    title.value = ''
    amount.value = null
    if (onSuccess) {
      nextTick(onSuccess)
    }

    return res
  }

  function reset(): void {
    title.value = ''
    amount.value = null
    error.value = null
  }

  return {
    title,
    amount,
    error,
    submit,
    reset,
  }
}
