import { nextTick } from 'vue'
import { beforeEach, describe, expect, it } from 'vitest'
import { useAppTheme } from '@/composables/useAppTheme'

describe('useAppTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.head.querySelectorAll('meta[name="theme-color"]').forEach((el) => el.remove())
  })

  it('toggles mode and updates meta theme-color tag', async () => {
    const meta = document.createElement('meta')
    meta.setAttribute('name', 'theme-color')
    meta.setAttribute('content', '#F8FAFB')
    document.head.appendChild(meta)

    const { isDark, toggle, mode } = useAppTheme()
    expect(mode.value).toBeDefined()

    const initialDark = isDark.value
    toggle()
    await nextTick()
    expect(isDark.value).toBe(!initialDark)

    const expectedColor = isDark.value ? '#020202' : '#F8FAFB'
    expect(meta.getAttribute('content')).toBe(expectedColor)
  })
})
