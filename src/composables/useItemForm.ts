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

function applySubmitError(
  res: Result<unknown> | undefined,
  errorRef: { value: string | null },
  onError?: (error: ValidationError) => void,
) {
  const errCode = res && !res.ok ? res.error : 'TITLE_EMPTY'
  errorRef.value = ERROR_MESSAGES[errCode] ?? 'Input tidak valid'
  if (onError) {
    nextTick(() => onError(errCode))
  }
  return res ?? { ok: false as const, error: errCode }
}

export function useItemForm<T>(
  onSubmit: (data: ItemFormSubmitData) => Result<T>,
  onSuccess?: () => void,
  onError?: (error: ValidationError) => void,
) {
  const title = ref('')
  const amount = ref<number | null>(null)
  const error = ref<string | null>(null)

  function submit(): Result<T> {
    error.value = null
    const res = onSubmit({ title: title.value, amount: amount.value ?? 0 })

    if (!res || !res.ok) {
      return applySubmitError(res, error, onError) as Result<T>
    }

    title.value = ''
    amount.value = null
    if (onSuccess) nextTick(onSuccess)
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
