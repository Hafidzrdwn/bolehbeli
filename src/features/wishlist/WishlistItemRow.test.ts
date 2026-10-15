import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vitest'
import WishlistItemRow from '@/features/wishlist/WishlistItemRow.vue'
import { setupConsoleGuard } from '@/test/console-guard'
import type { WishlistItem } from '@/types/finance'

const sampleItem: WishlistItem = {
  id: 'wish-1',
  title: 'Monitor 24 inch',
  price: 1_500_000,
  selected: true,
}

describe('WishlistItemRow: switch interactions', () => {
  setupConsoleGuard()

  it('emits toggle event exactly once per switch click and twice when clicked twice', async () => {
    const wrapper = mount(WishlistItemRow, {
      props: { item: sampleItem, baselineDailyBudget: 50_000 },
    })

    const switchBtn = wrapper.find('button[role="switch"]')
    await switchBtn.trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
    expect(wrapper.emitted('toggle')?.[0]).toEqual(['wish-1'])

    await switchBtn.trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(2)
  })
})

describe('WishlistItemRow: title and remove interactions', () => {
  setupConsoleGuard()

  it('emits toggle event when clicking on title label', async () => {
    const wrapper = mount(WishlistItemRow, {
      props: { item: sampleItem, baselineDailyBudget: 50_000 },
    })

    await wrapper.find('p.truncate').trigger('click')
    expect(wrapper.emitted('toggle')).toHaveLength(1)
    expect(wrapper.emitted('toggle')?.[0]).toEqual(['wish-1'])
  })

  it('emits remove event when clicking remove button', async () => {
    const wrapper = mount(WishlistItemRow, {
      props: { item: sampleItem, baselineDailyBudget: 50_000 },
    })

    await wrapper.find('button[aria-label="Hapus Monitor 24 inch"]').trigger('click')
    expect(wrapper.emitted('remove')).toHaveLength(1)
    expect(wrapper.emitted('remove')?.[0]).toEqual(['wish-1'])
  })
})
