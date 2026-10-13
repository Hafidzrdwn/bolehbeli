import { nextTick, ref, watch, type Ref } from 'vue'
import { formatDigits } from '@/lib/money'
import { reformatInput } from '@/lib/rupiah-input'

export function useRupiahInput(
  modelValue: Ref<number | null>,
  onUpdate: (val: number | null) => void,
) {
  const displayValue = ref(modelValue.value !== null ? formatDigits(modelValue.value) : '')

  watch(
    modelValue,
    (newVal) => {
      const formatted = newVal !== null ? formatDigits(newVal) : ''
      if (displayValue.value !== formatted) {
        displayValue.value = formatted
      }
    },
    { immediate: true },
  )

  function handleInput(event: Event): void {
    const el = event.target as HTMLInputElement
    const raw = el.value
    const caret = el.selectionStart ?? raw.length

    const res = reformatInput(raw, caret)
    displayValue.value = res.text
    el.value = res.text
    onUpdate(res.value)

    nextTick(() => {
      el.setSelectionRange(res.caret, res.caret)
    })
  }

  return {
    displayValue,
    handleInput,
  }
}
