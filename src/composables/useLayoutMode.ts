import { computed } from 'vue'
import { useMediaQuery } from '@vueuse/core'

export type LayoutMode = 'phone' | 'tablet' | 'desktop'

export function useLayoutMode() {
  const isDesktop = useMediaQuery('(min-width: 1024px)')
  const isTablet = useMediaQuery('(min-width: 768px)')

  const layoutMode = computed<LayoutMode>(() => {
    if (isDesktop.value) return 'desktop'
    if (isTablet.value) return 'tablet'
    return 'phone'
  })

  return {
    isDesktop,
    isTablet,
    layoutMode,
  }
}

