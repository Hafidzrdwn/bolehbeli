import {
  BUFFER_DIVISOR,
  DAILY_DROP_WARN_PERCENT,
  MIN_BUFFER,
} from '@/lib/constants'
import { buildMessage } from '@/lib/finance/messages'
import type {
  DecisionInput,
  DecisionReason,
  DecisionResult,
  DecisionStatus,
} from '@/types/finance'

export function resolveBuffer(balance: number, override: number | null): number {
  if (override !== null && override >= 0) {
    return Math.floor(override)
  }
  return Math.max(MIN_BUFFER, Math.floor(balance / BUFFER_DIVISOR))
}

function computeMetrics(input: DecisionInput, buffer: number) {
  const days = Math.max(1, input.daysRemaining)
  const sisa0 = input.balance - input.needsTotal
  const sisaFinal = sisa0 - input.wishlistTotal
  const daily0 = Math.floor(sisa0 / days)
  const dailyFinal = Math.floor(sisaFinal / days)
  const dailyDrop = Math.max(0, daily0 - dailyFinal)
  const dailyDropPercent =
    daily0 > 0 ? Math.min(100, Math.max(0, Math.round((dailyDrop * 100) / daily0))) : 0
  const shortfall = Math.max(0, -sisaFinal)
  const hasSelection = input.wishlistTotal > 0
  const equivalentDays =
    hasSelection && daily0 > 0 ? Math.round((input.wishlistTotal / daily0) * 10) / 10 : null

  return {
    days,
    sisa0,
    sisaFinal,
    daily0,
    dailyFinal,
    dailyDrop,
    dailyDropPercent,
    shortfall,
    hasSelection,
    equivalentDays,
    buffer,
  }
}

function collectWarningReasons(
  sisaFinal: number,
  buffer: number,
  daily0: number,
  dailyFinal: number,
  minDailyBudget: number,
): DecisionReason[] {
  const reasons: DecisionReason[] = []

  if (sisaFinal < buffer) {
    reasons.push('below_buffer')
  }
  if (dailyFinal < minDailyBudget) {
    reasons.push('below_min_daily')
  }
  // Integer cross multiplication to prevent floating point inaccuracies
  if (daily0 > 0 && (daily0 - dailyFinal) * 100 > daily0 * DAILY_DROP_WARN_PERCENT) {
    reasons.push('daily_drop_exceeded')
  }

  return reasons
}

function determineStatusAndReasons(
  sisaFinal: number,
  buffer: number,
  daily0: number,
  dailyFinal: number,
  minDailyBudget: number,
): { status: DecisionStatus; reasons: DecisionReason[] } {
  if (sisaFinal < 0) {
    return { status: 'danger', reasons: ['deficit'] }
  }

  const reasons = collectWarningReasons(sisaFinal, buffer, daily0, dailyFinal, minDailyBudget)
  return {
    status: reasons.length > 0 ? 'warning' : 'safe',
    reasons,
  }
}

function createDecisionMessage(
  input: DecisionInput,
  status: DecisionStatus,
  reasons: DecisionReason[],
  m: ReturnType<typeof computeMetrics>,
  buffer: number,
) {
  return buildMessage({
    status,
    reasons,
    hasSelection: m.hasSelection,
    dailyFinal: m.dailyFinal,
    buffer,
    sisaFinal: m.sisaFinal,
    minDailyBudget: input.minDailyBudget,
    dailyDrop: m.dailyDrop,
    dailyDropPercent: m.dailyDropPercent,
    shortfall: m.shortfall,
    needsTotal: input.needsTotal,
    balance: input.balance,
    wishlistTotal: input.wishlistTotal,
    daily0: m.daily0,
  })
}

export function evaluateDecision(input: DecisionInput): DecisionResult {
  const buffer = resolveBuffer(input.balance, input.bufferThreshold)
  const m = computeMetrics(input, buffer)
  const { status, reasons } = determineStatusAndReasons(
    m.sisaFinal,
    buffer,
    m.daily0,
    m.dailyFinal,
    input.minDailyBudget,
  )
  const message = createDecisionMessage(input, status, reasons, m, buffer)

  return {
    status,
    reasons,
    hasSelection: m.hasSelection,
    daysRemaining: m.days,
    buffer,
    sisa0: m.sisa0,
    sisaFinal: m.sisaFinal,
    daily0: m.daily0,
    dailyFinal: m.dailyFinal,
    dailyDrop: m.dailyDrop,
    dailyDropPercent: m.dailyDropPercent,
    shortfall: m.shortfall,
    equivalentDays: m.equivalentDays,
    message,
  }
}
