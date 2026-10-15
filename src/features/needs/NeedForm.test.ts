import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import NeedsSection from '@/features/needs/NeedsSection.vue'
import { useFinanceStore } from '@/stores/finance'
import { setupConsoleGuard } from '@/test/console-guard'

describe('NeedsSection: validation errors', () => {
  setupConsoleGuard()

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('handles empty submission with inline error and focus without console errors', async () => {
    const wrapper = mount(NeedsSection, { attachTo: document.body })
    await wrapper.find('button[type="submit"]').trigger('submit')
    await nextTick()

    const errorEl = wrapper.find('#need-form-error')
    expect(errorEl.exists()).toBe(true)
    expect(errorEl.text()).toBe('Isi nama dulu')
    expect(document.activeElement?.id).toBe('need-title-input')
    wrapper.unmount()
  })

  it('moves focus to amount input when title is filled but amount is invalid', async () => {
    const wrapper = mount(NeedsSection, { attachTo: document.body })
    await wrapper.find('#need-title-input').setValue('Kopi')
    await wrapper.find('button[type="submit"]').trigger('submit')
    await nextTick()

    const errorEl = wrapper.find('#need-form-error')
    expect(errorEl.exists()).toBe(true)
    expect(errorEl.text()).toBe('Nominal harus lebih dari 0')
    expect(document.activeElement?.id).toBe('need-amount-input')
    wrapper.unmount()
  })
})

describe('NeedsSection: valid submission', () => {
  setupConsoleGuard()

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('adds valid item to store, clears inputs, and returns focus to title', async () => {
    const store = useFinanceStore()
    const wrapper = mount(NeedsSection, { attachTo: document.body })
    const titleInput = wrapper.find('#need-title-input')
    const amountInput = wrapper.find('#need-amount-input')

    await titleInput.setValue('Listrik')
    await amountInput.setValue('150000')
    await wrapper.find('button[type="submit"]').trigger('submit')
    await nextTick()

    expect(store.state.needs).toHaveLength(1)
    expect(store.state.needs[0]?.title).toBe('Listrik')
    expect(store.state.needs[0]?.amount).toBe(150_000)
    expect((titleInput.element as HTMLInputElement).value).toBe('')
    expect((amountInput.element as HTMLInputElement).value).toBe('')
    expect(document.activeElement?.id).toBe('need-title-input')
    wrapper.unmount()
  })
})
