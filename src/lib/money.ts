import { MAX_AMOUNT } from '@/lib/constants'

const idrFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

const digitsFormatter = new Intl.NumberFormat('id-ID', {
  maximumFractionDigits: 0,
})

export function formatIDR(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.floor(amount) : 0
  return idrFormatter.format(safe)
}

export function formatDigits(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.floor(amount) : 0
  return digitsFormatter.format(safe)
}

export function clampAmount(amount: number): number {
  if (!Number.isFinite(amount) || amount <= 0) return 0
  return Math.min(Math.floor(amount), MAX_AMOUNT)
}

export function parseRupiah(input: string): number | null {
  if (typeof input !== 'string') return null

  // Buang desimal 1-2 digit di akhir gaya Indonesia (,dd) sebelum ekstrak angka
  const withoutDecimal = input.trim().replace(/,\d{1,2}$/, '')
  const digits = withoutDecimal.replace(/\D/g, '')

  if (digits.length === 0) return null

  const parsed = Number(digits)
  if (!Number.isFinite(parsed)) return null

  return Math.min(parsed, MAX_AMOUNT)
}

export function formatCompactIDR(amount: number): string {
  if (!Number.isFinite(amount)) return 'Rp 0'
  const isNegative = amount < 0
  const abs = Math.abs(Math.floor(amount))
  const prefix = isNegative ? '-Rp ' : 'Rp '

  if (abs < 1_000) return `${prefix}${abs}`

  if (abs < 1_000_000) {
    const thousands = Math.round(abs / 1_000)
    if (thousands >= 1_000) return `${prefix}1 jt`
    return `${prefix}${thousands} rb`
  }

  let divisor = 1_000_000
  let unit = 'jt'

  if (abs >= 1_000_000_000) {
    divisor = 1_000_000_000
    unit = 'M'
  }

  const rounded = Math.round((abs / divisor) * 10) / 10
  if (rounded >= 1_000) {
    return unit === 'jt' ? `${prefix}1 M` : `${prefix}1.000 M`
  }

  const num = rounded.toLocaleString('id-ID', {
    maximumFractionDigits: 1,
  })

  return `${prefix}${num} ${unit}`
}
