import { nextTick } from 'vue'
import { describe, expect, it } from 'vitest'
import { useItemForm } from '@/composables/useItemForm'
import type { Result } from '@/types/finance'

describe('useItemForm submit success and reset', () => {
  it('submits successfully and resets fields', async () => {
    let submittedPayload: { title: string; amount: number } | null = null
    let successCalled = false

    const { title, amount, error, submit } = useItemForm(
      (data) => {
        submittedPayload = data
        return { ok: true, value: { id: 'test-1', ...data } }
      },
      () => {
        successCalled = true
      },
    )

    title.value = 'Belanja Bulanan'
    amount.value = 500_000

    const res = submit()
    expect(res.ok).toBe(true)
    expect(submittedPayload).toEqual({ title: 'Belanja Bulanan', amount: 500_000 })
    expect(title.value).toBe('')
    expect(amount.value).toBeNull()
    expect(error.value).toBeNull()

    await nextTick()
    expect(successCalled).toBe(true)
  })

  it('resets form state on reset call', () => {
    const { title, amount, error, reset } = useItemForm(() => ({ ok: true, value: null }))
    title.value = 'Makan'
    amount.value = 25000
    error.value = 'Some error'

    reset()
    expect(title.value).toBe('')
    expect(amount.value).toBeNull()
    expect(error.value).toBeNull()
  })
})

describe('useItemForm error mapping', () => {
  it('maps validation errors to Indonesian messages', () => {
    const errorCodes: Array<'TITLE_EMPTY' | 'AMOUNT_INVALID' | 'LIMIT_REACHED'> = [
      'TITLE_EMPTY',
      'AMOUNT_INVALID',
      'LIMIT_REACHED',
    ]

    for (const code of errorCodes) {
      const { title, amount, error, submit } = useItemForm<null>(() => {
        return { ok: false, error: code } as Result<null>
      })

      title.value = 'Test'
      amount.value = 100

      const res = submit()
      expect(res.ok).toBe(false)
      expect(error.value).toBeTruthy()
    }
  })
})
