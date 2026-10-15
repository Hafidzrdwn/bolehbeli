import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFinanceStore } from '@/stores/finance'
import BalanceHero from './BalanceHero.vue'

describe('BalanceHero inline edit flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('switches to edit mode on click and saves on Enter', async () => {
    const store = useFinanceStore()
    store.setBalance(1_500_000)
    const wrapper = mount(BalanceHero)

    const viewButton = wrapper.find('[aria-label="Ubah saldo"]')
    expect(viewButton.exists()).toBe(true)

    await viewButton.trigger('click')
    const input = wrapper.find<HTMLInputElement>('#balance-input')
    expect(input.exists()).toBe(true)

    await input.setValue('2.000.000')
    await input.trigger('keydown', { key: 'Enter' })

    expect(store.state.currentBalance).toBe(2_000_000)
    expect(wrapper.find('[aria-label="Ubah saldo"]').exists()).toBe(true)
  })

  it('cancels edit and restores initial balance on Escape', async () => {
    const store = useFinanceStore()
    store.setBalance(1_500_000)
    const wrapper = mount(BalanceHero)

    await wrapper.find('[aria-label="Ubah saldo"]').trigger('click')
    const input = wrapper.find<HTMLInputElement>('#balance-input')
    await input.setValue('9.999.000')
    await input.trigger('keydown', { key: 'Escape' })

    expect(store.state.currentBalance).toBe(1_500_000)
    expect(wrapper.find('[aria-label="Ubah saldo"]').exists()).toBe(true)
  })
})
