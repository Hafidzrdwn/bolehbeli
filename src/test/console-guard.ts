import { afterEach, beforeEach, vi } from 'vitest'

export function setupConsoleGuard(): void {
  let errorSpy: ReturnType<typeof vi.spyOn>
  let warnSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    const errorCalls = errorSpy?.mock?.calls ?? []
    const warnCalls = warnSpy?.mock?.calls ?? []

    errorSpy?.mockRestore()
    warnSpy?.mockRestore()

    if (errorCalls.length > 0) {
      const messages = (errorCalls as unknown[][]).map((args) => args.map(String).join(' ')).join('\n')
      throw new Error(`Unexpected console.error:\n${messages}`)
    }

    if (warnCalls.length > 0) {
      const messages = (warnCalls as unknown[][]).map((args) => args.map(String).join(' ')).join('\n')
      throw new Error(`Unexpected console.warn:\n${messages}`)
    }
  })
}
