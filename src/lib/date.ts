const MS_PER_DAY = 86_400_000

const indonesianDateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  timeZone: 'UTC',
})

export function todayISO(now = new Date()): string {
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function isValidISODate(iso: string): boolean {
  if (typeof iso !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(iso)) {
    return false
  }

  const [year, month, day] = iso.split('-').map(Number)
  if (!year || !month || !day) return false

  const date = new Date(Date.UTC(year, month - 1, day))
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  )
}

export function diffInDays(fromISO: string, toISO: string): number {
  const [fromY, fromM, fromD] = fromISO.split('-').map(Number)
  const [toY, toM, toD] = toISO.split('-').map(Number)

  const fromTime = Date.UTC(fromY!, fromM! - 1, fromD!)
  const toTime = Date.UTC(toY!, toM! - 1, toD!)

  return Math.round((toTime - fromTime) / MS_PER_DAY)
}

export function endOfMonthISO(iso: string): string {
  const [year, month] = iso.split('-').map(Number)
  const lastDay = new Date(Date.UTC(year!, month!, 0)).getUTCDate()
  const mm = String(month).padStart(2, '0')
  const dd = String(lastDay).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

export function nextDayOfMonthISO(day: number, fromISO: string): string {
  const [year, month, currentDay] = fromISO.split('-').map(Number)
  const lastDayThisMonth = new Date(Date.UTC(year!, month!, 0)).getUTCDate()
  const clampedDayThisMonth = Math.min(Math.max(1, day), lastDayThisMonth)

  if (clampedDayThisMonth > currentDay!) {
    const mm = String(month).padStart(2, '0')
    const dd = String(clampedDayThisMonth).padStart(2, '0')
    return `${year}-${mm}-${dd}`
  }

  const nextYear = month === 12 ? year! + 1 : year!
  const nextMonth = month === 12 ? 1 : month! + 1
  const lastDayNextMonth = new Date(Date.UTC(nextYear, nextMonth, 0)).getUTCDate()
  const clampedDayNextMonth = Math.min(Math.max(1, day), lastDayNextMonth)

  const nextMM = String(nextMonth).padStart(2, '0')
  const nextDD = String(clampedDayNextMonth).padStart(2, '0')
  return `${nextYear}-${nextMM}-${nextDD}`
}

export function formatDateID(iso: string): string {
  if (!isValidISODate(iso)) return ''
  const [year, month, day] = iso.split('-').map(Number)
  const date = new Date(Date.UTC(year!, month! - 1, day!))
  return indonesianDateFormatter.format(date)
}
