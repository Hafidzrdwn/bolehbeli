import { boolean, enum as zEnum, number, object, string } from 'zod'
import {
  DEFAULT_MIN_DAILY_BUDGET,
  EXPENSE_CATEGORIES,
  MAX_AMOUNT,
  MAX_ITEMS,
} from '@/lib/constants'
import { endOfMonthISO, isValidISODate } from '@/lib/date'
import { sanitizeTitle } from '@/lib/sanitize'
import type { ExpenseItem, FinanceState, WishlistItem } from '@/types/finance'

const amountSchema = number().int().min(0).max(MAX_AMOUNT)
const titleSchema = string().transform(sanitizeTitle).pipe(string().min(1))

export const expenseItemSchema = object({
  id: string().min(1).max(64),
  title: titleSchema,
  amount: amountSchema,
  category: zEnum(EXPENSE_CATEGORIES).catch('other'),
})

export const wishlistItemSchema = object({
  id: string().min(1).max(64),
  title: titleSchema,
  price: amountSchema,
  selected: boolean().catch(false),
})

export function createDefaultState(today: string): FinanceState {
  return {
    currentBalance: 0,
    targetDate: endOfMonthISO(today),
    bufferThreshold: null,
    minDailyBudget: DEFAULT_MIN_DAILY_BUDGET,
    needs: [],
    wishlist: [],
  }
}

function parseNeedsArray(raw: unknown): ExpenseItem[] {
  if (!Array.isArray(raw)) return []
  const items: ExpenseItem[] = []
  const seenIds = new Set<string>()

  for (const entry of raw) {
    if (items.length >= MAX_ITEMS) break
    const parsed = expenseItemSchema.safeParse(entry)
    if (parsed.success && !seenIds.has(parsed.data.id)) {
      seenIds.add(parsed.data.id)
      items.push(parsed.data)
    }
  }
  return items
}

function parseWishlistArray(raw: unknown): WishlistItem[] {
  if (!Array.isArray(raw)) return []
  const items: WishlistItem[] = []
  const seenIds = new Set<string>()

  for (const entry of raw) {
    if (items.length >= MAX_ITEMS) break
    const parsed = wishlistItemSchema.safeParse(entry)
    if (parsed.success && !seenIds.has(parsed.data.id)) {
      seenIds.add(parsed.data.id)
      items.push(parsed.data)
    }
  }
  return items
}

export function parseFinanceState(input: unknown, today: string): FinanceState {
  const d = createDefaultState(today)
  if (!input || typeof input !== 'object') return d

  const obj = input as Record<string, unknown>
  const currentBalance = amountSchema.catch(d.currentBalance).parse(obj.currentBalance)
  const targetDate = string()
    .refine(isValidISODate)
    .catch(d.targetDate)
    .parse(obj.targetDate)
  const bufferThreshold = number()
    .int()
    .min(0)
    .max(MAX_AMOUNT)
    .nullable()
    .catch(null)
    .parse(obj.bufferThreshold ?? null)
  const minDailyBudget = amountSchema.catch(d.minDailyBudget).parse(obj.minDailyBudget)

  return {
    currentBalance,
    targetDate,
    bufferThreshold,
    minDailyBudget,
    needs: parseNeedsArray(obj.needs),
    wishlist: parseWishlistArray(obj.wishlist),
  }
}
