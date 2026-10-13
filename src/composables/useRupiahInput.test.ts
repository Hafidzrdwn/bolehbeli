import { ref } from 'vue'
import { describe, expect, it } from 'vitest'
import { useRupiahInput } from '@/composables/useRupiahInput'

describe('useRupiahInput', () => {
  it('formats initial value and updates on input events', () => {
    const model = ref<number | null>(1500000)
    let updated: number | null = null

    const { displayValue, handleInput } = useRupiahInput(model, (val) => {
      updated = val
      model.value = val
    })

    expect(displayValue.value).toBe('1.500.000')

    const inputEl = document.createElement('input')
    inputEl.value = '2500000'
    inputEl.selectionStart = 7

    handleInput({ target: inputEl } as unknown as Event)
    expect(displayValue.value).toBe('2.500.000')
    expect(updated).toBe(2500000)
  })

  it('handles clearing input to null', () => {
    const model = ref<number | null>(1000)
    let updated: number | null = null

    const { displayValue, handleInput } = useRupiahInput(model, (val) => {
      updated = val
      model.value = val
    })

    const inputEl = document.createElement('input')
    inputEl.value = ''
    inputEl.selectionStart = 0

    handleInput({ target: inputEl } as unknown as Event)
    expect(displayValue.value).toBe('')
    expect(updated).toBeNull()
  })
})
