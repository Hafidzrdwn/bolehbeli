import { describe, expect, it } from 'vitest'
import { daysOfBudget } from './days-of-budget'

describe('daysOfBudget helper', () => {
  it('calculates integer days of budget correctly', () => {
    expect(daysOfBudget(600_000, 100_000)).toBe(6)
  })

  it('calculates decimal days of budget rounded to 1 decimal place', () => {
    expect(daysOfBudget(250_000, 100_000)).toBe(2.5)
    expect(daysOfBudget(100_000, 30_000)).toBe(3.3)
  })

  it('returns null when baselineDailyBudget is zero or negative', () => {
    expect(daysOfBudget(600_000, 0)).toBeNull()
    expect(daysOfBudget(600_000, -50_000)).toBeNull()
  })

  it('returns null when inputs are non-finite or invalid', () => {
    expect(daysOfBudget(NaN, 100_000)).toBeNull()
    expect(daysOfBudget(600_000, NaN)).toBeNull()
    expect(daysOfBudget(600_000, Infinity)).toBeNull()
    expect(daysOfBudget(-100_000, 50_000)).toBeNull()
    expect(daysOfBudget(0, 50_000)).toBeNull()
  })
})
