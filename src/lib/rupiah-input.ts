import { formatDigits, parseRupiah } from '@/lib/money'

export interface ReformatResult {
  value: number | null
  text: string
  caret: number
}

export function reformatInput(rawText: string, caret: number): ReformatResult {
  const safeCaret = Math.max(0, Math.min(caret, rawText.length))
  const prefix = rawText.slice(0, safeCaret)
  const digitsBeforeCaret = prefix.replace(/\D/g, '').length

  const parsed = parseRupiah(rawText)
  if (parsed === null) {
    return { value: null, text: '', caret: 0 }
  }

  const formatted = formatDigits(parsed)
  if (digitsBeforeCaret === 0) {
    return { value: parsed, text: formatted, caret: 0 }
  }

  let count = 0
  let targetCaret = formatted.length

  for (let i = 0; i < formatted.length; i++) {
    if (/\d/.test(formatted[i]!)) {
      count++
    }
    if (count === digitsBeforeCaret) {
      targetCaret = i + 1
      break
    }
  }

  return {
    value: parsed,
    text: formatted,
    caret: targetCaret,
  }
}
