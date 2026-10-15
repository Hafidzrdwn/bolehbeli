import { createPinia, setActivePinia } from 'pinia'
import { mount } from '@vue/test-utils'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { nextTick } from 'vue'
import WishlistForm from '@/features/wishlist/WishlistForm.vue'
import { useFinanceStore } from '@/stores/finance'
import { setupConsoleGuard } from '@/test/console-guard'

describe('WishlistForm regression', () => {
  setupConsoleGuard()

  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('adds new item with selected === true and increments totalActiveWishlist', async () => {
    const store = useFinanceStore()
    expect(store.totalActiveWishlist).toBe(0)

    const wrapper = mount(WishlistForm, {
      attachTo: document.body,
    })

    const titleInput = wrapper.find('#wishlist-title-input')
    const priceInput = wrapper.find('#wishlist-price-input')

    await titleInput.setValue('Keyboard Mechanical')
    await priceInput.setValue('500000')

    const submitBtn = wrapper.find('button[type="submit"]')
    await submitBtn.trigger('submit')
    await nextTick()

    expect(store.state.wishlist).toHaveLength(1)
    expect(store.state.wishlist[0]?.title).toBe('Keyboard Mechanical')
    expect(store.state.wishlist[0]?.price).toBe(500_000)
    expect(store.state.wishlist[0]?.selected).toBe(true)
    expect(store.totalActiveWishlist).toBe(500_000)

    wrapper.unmount()
  })
})
