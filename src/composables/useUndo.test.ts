import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useUndo } from './useUndo'

describe('useUndo record and clear', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const { dismiss } = useUndo()
    dismiss()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('records an entry and automatically clears after 5000ms', () => {
    const { currentEntry, record } = useUndo()
    const action = vi.fn()

    record('Makan dihapus', action)
    expect(currentEntry.value?.message).toBe('Makan dihapus')

    vi.advanceTimersByTime(4999)
    expect(currentEntry.value).not.toBeNull()

    vi.advanceTimersByTime(2)
    expect(currentEntry.value).toBeNull()
    expect(action).not.toHaveBeenCalled()
  })

  it('executes action and clears entry on undo', () => {
    const { currentEntry, record, undo } = useUndo()
    const action = vi.fn()

    record('Makan dihapus', action)
    undo()

    expect(action).toHaveBeenCalledTimes(1)
    expect(currentEntry.value).toBeNull()
  })
})

describe('useUndo pause and resume', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    const { dismiss } = useUndo()
    dismiss()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('pauses and resumes timer correctly', () => {
    const { currentEntry, record, pause, resume } = useUndo()
    const action = vi.fn()

    record('Makan dihapus', action)
    vi.advanceTimersByTime(2000)

    pause()
    vi.advanceTimersByTime(5000)
    expect(currentEntry.value).not.toBeNull()

    resume()
    vi.advanceTimersByTime(2999)
    expect(currentEntry.value).not.toBeNull()

    vi.advanceTimersByTime(2)
    expect(currentEntry.value).toBeNull()
  })
})
