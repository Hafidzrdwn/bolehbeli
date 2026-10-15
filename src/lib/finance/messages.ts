import { formatIDR } from '@/lib/money'
import type { DecisionMessage, DecisionReason, DecisionStatus } from '@/types/finance'

export interface BuildMessageContext {
  status: DecisionStatus
  reasons: DecisionReason[]
  hasSelection: boolean
  dailyFinal: number
  buffer: number
  sisaFinal: number
  minDailyBudget: number
  dailyDrop: number
  dailyDropPercent: number
  shortfall: number
  needsTotal: number
  balance?: number
  wishlistTotal?: number
  daily0?: number
}

function buildWarningDetail(ctx: BuildMessageContext): string {
  const parts: string[] = []

  for (const reason of ctx.reasons) {
    if (reason === 'below_buffer') {
      parts.push(`Sisa uangmu (${formatIDR(ctx.sisaFinal)}) di bawah buffer ${formatIDR(ctx.buffer)}.`)
    } else if (reason === 'below_min_daily') {
      parts.push(
        `Jatah harian ${formatIDR(ctx.dailyFinal)} di bawah batas minimum ${formatIDR(ctx.minDailyBudget)}.`,
      )
    } else if (reason === 'daily_drop_exceeded') {
      parts.push(`Jatah harianmu kepotong ${formatIDR(ctx.dailyDrop)}/hari (${ctx.dailyDropPercent}%).`)
    }
  }

  return parts.join(' ')
}

function buildSafeOrIdleMessage(ctx: BuildMessageContext): DecisionMessage {
  if (ctx.hasSelection) {
    return {
      tone: 'safe',
      emoji: '🟢',
      headline: 'Aman, bungkus!',
      detail: `Jatahmu tetap ${formatIDR(ctx.dailyFinal)}/hari dan buffer ${formatIDR(ctx.buffer)} masih utuh.`,
    }
  }
  const daily0 = ctx.daily0 ?? ctx.dailyFinal
  return {
    tone: 'idle',
    emoji: '🎯',
    headline: 'Pilih barang untuk disimulasikan',
    detail: `Dengan kebutuhan wajib saat ini, jatahmu ${formatIDR(daily0)}/hari sampai akhir periode.`,
  }
}

function buildDangerMessage(ctx: BuildMessageContext): DecisionMessage {
  return {
    tone: 'danger',
    emoji: '🔴',
    headline: ctx.hasSelection ? 'Skip dulu!' : 'Kebutuhan melebihi saldo',
    detail: ctx.hasSelection
      ? `Kurang ${formatIDR(ctx.shortfall)} untuk menutup kebutuhan wajib.`
      : `Kebutuhan wajib ${formatIDR(ctx.needsTotal)} melebihi saldo; kurang ${formatIDR(ctx.shortfall)}.`,
  }
}

export function buildMessage(ctx: BuildMessageContext): DecisionMessage {
  const balance = ctx.balance ?? 0
  const wishlistTotal = ctx.wishlistTotal ?? (ctx.hasSelection ? 1 : 0)

  if (balance === 0 && ctx.needsTotal === 0 && wishlistTotal === 0) {
    return {
      tone: 'idle',
      emoji: '🎯',
      headline: 'Mulai dari saldo',
      detail: 'Isi saldo dan kebutuhan wajib, lalu pilih barang yang mau dibeli.',
    }
  }

  if (ctx.status === 'safe') return buildSafeOrIdleMessage(ctx)
  if (ctx.status === 'danger') return buildDangerMessage(ctx)

  return {
    tone: 'warning',
    emoji: '🟡',
    headline: 'Tahan dulu!',
    detail: buildWarningDetail(ctx),
  }
}
