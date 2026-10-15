import type { EXPENSE_CATEGORIES } from '@/lib/constants'

export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number]

export interface ExpenseItem {
  id: string
  title: string
  amount: number
  category: ExpenseCategory
}

export interface WishlistItem {
  id: string
  title: string
  price: number
  selected: boolean
}

export interface FinanceState {
  currentBalance: number
  targetDate: string
  bufferThreshold: number | null
  minDailyBudget: number
  needs: ExpenseItem[]
  wishlist: WishlistItem[]
}

export type DecisionStatus = 'safe' | 'warning' | 'danger'
export type DecisionReason = 'deficit' | 'below_buffer' | 'below_min_daily' | 'daily_drop_exceeded'

export interface DecisionInput {
  balance: number
  needsTotal: number
  wishlistTotal: number
  daysRemaining: number
  bufferThreshold: number | null
  minDailyBudget: number
}

export interface DecisionMessage {
  emoji: string
  headline: string
  detail: string
  tone: DecisionStatus | 'idle'
}

export interface DecisionResult {
  status: DecisionStatus
  reasons: DecisionReason[]
  hasSelection: boolean
  daysRemaining: number
  buffer: number
  sisa0: number
  sisaFinal: number
  daily0: number
  dailyFinal: number
  dailyDrop: number
  dailyDropPercent: number
  shortfall: number
  equivalentDays: number | null
  message: DecisionMessage
}

export type ValidationError = 'TITLE_EMPTY' | 'AMOUNT_INVALID' | 'LIMIT_REACHED'
export type Result<T> = { ok: true; value: T } | { ok: false; error: ValidationError }
