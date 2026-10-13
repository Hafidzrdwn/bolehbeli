import { describe, expect, it } from 'vitest'
import { buildMessage } from '@/lib/finance/messages'

describe('buildMessage safe status', () => {
  it('formats safe with selection', () => {
    const msg = buildMessage({
      status: 'safe',
      reasons: [],
      hasSelection: true,
      dailyFinal: 60_000,
      buffer: 300_000,
      sisaFinal: 900_000,
      minDailyBudget: 20_000,
      dailyDrop: 40_000,
      dailyDropPercent: 40,
      shortfall: 0,
      needsTotal: 1_500_000,
    })
    expect(msg.emoji).toBe('🟢')
    expect(msg.headline).toBe('Aman, bungkus!')
    expect(msg.detail).toContain('Jatahmu tetap')
    expect(msg.detail).toContain('/hari dan buffer')
    expect(msg.detail).toContain('masih utuh.')
  })

  it('formats safe without selection', () => {
    const msg = buildMessage({
      status: 'safe',
      reasons: [],
      hasSelection: false,
      dailyFinal: 100_000,
      buffer: 300_000,
      sisaFinal: 1_500_000,
      minDailyBudget: 20_000,
      dailyDrop: 0,
      dailyDropPercent: 0,
      shortfall: 0,
      needsTotal: 1_500_000,
    })
    expect(msg.emoji).toBe('🟢')
    expect(msg.headline).toBe('Kondisi aman')
    expect(msg.detail).toBe('Pilih barang di wishlist untuk simulasi pembelian.')
  })
})

describe('buildMessage warning status', () => {
  it('formats warning combining multiple reasons', () => {
    const msg = buildMessage({
      status: 'warning',
      reasons: ['below_buffer', 'below_min_daily', 'daily_drop_exceeded'],
      hasSelection: true,
      dailyFinal: 13_333,
      buffer: 300_000,
      sisaFinal: 200_000,
      minDailyBudget: 20_000,
      dailyDrop: 86_667,
      dailyDropPercent: 87,
      shortfall: 0,
      needsTotal: 1_500_000,
    })
    expect(msg.emoji).toBe('🟡')
    expect(msg.headline).toBe('Tahan dulu!')
    expect(msg.detail).toContain('di bawah buffer')
    expect(msg.detail).toContain('di bawah batas minimum')
    expect(msg.detail).toContain('Jatah harianmu kepotong')
  })
})

describe('buildMessage danger status', () => {
  it('formats danger with selection', () => {
    const msg = buildMessage({
      status: 'danger',
      reasons: ['deficit'],
      hasSelection: true,
      dailyFinal: -6_667,
      buffer: 300_000,
      sisaFinal: -100_000,
      minDailyBudget: 20_000,
      dailyDrop: 106_667,
      dailyDropPercent: 100,
      shortfall: 100_000,
      needsTotal: 1_500_000,
    })
    expect(msg.emoji).toBe('🔴')
    expect(msg.headline).toBe('Skip dulu!')
    expect(msg.detail).toContain('Kurang')
    expect(msg.detail).toContain('untuk menutup kebutuhan wajib.')
  })

  it('formats danger without selection', () => {
    const msg = buildMessage({
      status: 'danger',
      reasons: ['deficit'],
      hasSelection: false,
      dailyFinal: -30_000,
      buffer: 50_000,
      sisaFinal: -300_000,
      minDailyBudget: 20_000,
      dailyDrop: 0,
      dailyDropPercent: 0,
      shortfall: 300_000,
      needsTotal: 800_000,
    })
    expect(msg.emoji).toBe('🔴')
    expect(msg.headline).toBe('Kebutuhan melebihi saldo')
    expect(msg.detail).toContain('Kebutuhan wajib')
    expect(msg.detail).toContain('melebihi saldo; kurang')
  })
})
