import { beforeEach, describe, expect, it } from 'vitest'
import {
  DISMISS_DURATION_MS,
  INSTALL_DISMISS_KEY,
  isDismissActive,
} from '@/composables/useInstallPrompt'

describe('useInstallPrompt: dismiss tracking', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns false when not dismissed yet', () => {
    expect(isDismissActive()).toBe(false)
  })

  it('returns true when dismissed recently', () => {
    const now = 1_000_000_000
    localStorage.setItem(INSTALL_DISMISS_KEY, now.toString())
    expect(isDismissActive(now + 1000)).toBe(true)
  })

  it('returns false when 14 days duration has passed', () => {
    const now = 1_000_000_000
    localStorage.setItem(INSTALL_DISMISS_KEY, now.toString())
    expect(isDismissActive(now + DISMISS_DURATION_MS + 1000)).toBe(false)
  })

  it('handles corrupted storage value gracefully', () => {
    localStorage.setItem(INSTALL_DISMISS_KEY, 'not-a-timestamp')
    expect(isDismissActive()).toBe(false)
  })
})
