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
