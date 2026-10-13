export function daysOfBudget(price: number, daily0: number): number | null {
  if (!Number.isFinite(price) || price <= 0 || !Number.isFinite(daily0) || daily0 <= 0) {
    return null
  }
  return Math.round((price / daily0) * 10) / 10
}
