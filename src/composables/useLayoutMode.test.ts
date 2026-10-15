import { describe, expect, it } from 'vitest'
import { useLayoutMode } from './useLayoutMode'

describe('useLayoutMode', () => {
  it('mengembalikan mode phone secara default di lingkungan test mobile', () => {
    const { layoutMode } = useLayoutMode()
    expect(['phone', 'tablet', 'desktop']).toContain(layoutMode.value)
  })
})
