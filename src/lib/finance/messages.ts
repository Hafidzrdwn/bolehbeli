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

export function buildMessage(ctx: BuildMessageContext): DecisionMessage {
  if (ctx.status === 'safe') {
    return ctx.hasSelection
      ? {
          emoji: '🟢',
          headline: 'Aman, bungkus!',
          detail: `Jatahmu tetap ${formatIDR(ctx.dailyFinal)}/hari dan buffer ${formatIDR(ctx.buffer)} masih utuh.`,
        }
      : {
          emoji: '🟢',
          headline: 'Kondisi aman',
          detail: 'Pilih barang di wishlist untuk simulasi pembelian.',
        }
  }

  if (ctx.status === 'danger') {
    return ctx.hasSelection
      ? {
          emoji: '🔴',
          headline: 'Skip dulu!',
          detail: `Kurang ${formatIDR(ctx.shortfall)} untuk menutup kebutuhan wajib.`,
        }
      : {
          emoji: '🔴',
          headline: 'Kebutuhan melebihi saldo',
          detail: `Kebutuhan wajib ${formatIDR(ctx.needsTotal)} melebihi saldo; kurang ${formatIDR(ctx.shortfall)}.`,
        }
  }

  return {
    emoji: '🟡',
    headline: 'Tahan dulu!',
    detail: buildWarningDetail(ctx),
  }
}
