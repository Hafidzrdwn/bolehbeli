import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { beforeEach, describe, expect, it } from 'vitest'
import NeedsSection from './NeedsSection.vue'

describe('NeedsSection: Preset chip toggle and keyboard flow', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('toggles preset chip on and off, clearing title if matched', async () => {
    const wrapper = mount(NeedsSection)

    const buttons = wrapper.findAll('button[type="button"]')
    const makanBtn = buttons.find((btn) => btn.text().includes('Makan'))
    expect(makanBtn).toBeDefined()

    await makanBtn!.trigger('click')
    const input = wrapper.find<HTMLInputElement>('#need-title-input')
    expect(input.element.value).toBe('Makan')
    expect(makanBtn!.attributes('aria-pressed')).toBe('true')

    await makanBtn!.trigger('click')
    expect(input.element.value).toBe('')
    expect(makanBtn!.attributes('aria-pressed')).toBe('false')
  })

  it('deselects chip automatically when title is changed manually', async () => {
    const wrapper = mount(NeedsSection)

    const buttons = wrapper.findAll('button[type="button"]')
    const makanBtn = buttons.find((btn) => btn.text().includes('Makan'))
    await makanBtn!.trigger('click')
    expect(makanBtn!.attributes('aria-pressed')).toBe('true')

    const input = wrapper.find<HTMLInputElement>('#need-title-input')
    await input.setValue('Makan siang')
    expect(makanBtn!.attributes('aria-pressed')).toBe('false')
  })
})
