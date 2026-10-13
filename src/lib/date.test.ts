import { describe, expect, it } from 'vitest'
import {
  diffInDays,
  endOfMonthISO,
  formatDateID,
  isValidISODate,
  nextDayOfMonthISO,
  todayISO,
} from '@/lib/date'

describe('todayISO', () => {
  it('formats current date as YYYY-MM-DD', () => {
    const fixedDate = new Date(2026, 9, 14) // month index 9 = October
    expect(todayISO(fixedDate)).toBe('2026-10-14')
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })
})

describe('isValidISODate', () => {
  it('validates genuine calendar dates in YYYY-MM-DD format', () => {
    expect(isValidISODate('2026-10-14')).toBe(true)
    expect(isValidISODate('2028-02-29')).toBe(true) // leap year
  })

  it('rejects invalid calendar dates and bad formats', () => {
    expect(isValidISODate('2026-02-30')).toBe(false)
    expect(isValidISODate('2026-02-29')).toBe(false) // non-leap year
    expect(isValidISODate('2026-13-01')).toBe(false)
    expect(isValidISODate('2026-10-32')).toBe(false)
    expect(isValidISODate('not-a-date')).toBe(false)
    expect(isValidISODate('2026/10/14')).toBe(false)
  })
})

describe('diffInDays', () => {
  it('calculates calendar difference in UTC days between two ISO dates', () => {
    expect(diffInDays('2026-10-14', '2026-10-31')).toBe(17)
    expect(diffInDays('2026-10-31', '2026-10-14')).toBe(-17)
    expect(diffInDays('2026-10-14', '2026-10-14')).toBe(0)
  })
})

describe('endOfMonthISO', () => {
  it('returns last calendar day of the given ISO date month', () => {
    expect(endOfMonthISO('2026-10-14')).toBe('2026-10-31')
    expect(endOfMonthISO('2026-11-05')).toBe('2026-11-30')
    expect(endOfMonthISO('2026-02-10')).toBe('2026-02-28')
    expect(endOfMonthISO('2028-02-10')).toBe('2028-02-29') // leap year
  })
})

describe('nextDayOfMonthISO', () => {
  it('picks target day in current month if still upcoming', () => {
    expect(nextDayOfMonthISO(25, '2026-10-14')).toBe('2026-10-25')
  })

  it('rolls over to next month if target day has passed in current month', () => {
    expect(nextDayOfMonthISO(1, '2026-10-14')).toBe('2026-11-01')
  })

  it('clamps to last day of month when target day exceeds month length', () => {
    expect(nextDayOfMonthISO(31, '2026-11-05')).toBe('2026-11-30')
  })

  it('rolls over to January of next year from December', () => {
    expect(nextDayOfMonthISO(25, '2026-12-28')).toBe('2027-01-25')
  })
})

describe('formatDateID', () => {
  it('formats valid ISO date into Indonesian short date representation', () => {
    const formatted = formatDateID('2026-10-14')
    expect(formatted).toMatch(/14\s+Okt(b)?\s+2026/i)
  })

  it('returns empty string for invalid date', () => {
    expect(formatDateID('invalid-date')).toBe('')
  })
})
