import { computed, watch } from 'vue'
import { useColorMode } from '@vueuse/core'

const LIGHT_THEME_COLOR = '#F8FAFB'
const DARK_THEME_COLOR = '#020202'

export function useAppTheme() {
  const mode = useColorMode({
    storageKey: 'boleh-beli:theme',
    modes: { dark: 'dark', light: 'light' },
  })

  const isDark = computed(() => mode.value === 'dark')

  function toggle(): void {
    mode.value = isDark.value ? 'light' : 'dark'
  }

  watch(
    isDark,
    (dark) => {
      if (typeof document === 'undefined') return
      const color = dark ? DARK_THEME_COLOR : LIGHT_THEME_COLOR
      const metas = document.querySelectorAll('meta[name="theme-color"]')
      metas.forEach((meta) => meta.setAttribute('content', color))
    },
    { immediate: true },
  )

  return {
    mode,
    isDark,
    toggle,
  }
}
