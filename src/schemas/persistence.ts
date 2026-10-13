import type { Serializer } from '@vueuse/core'
import { SCHEMA_VERSION } from '@/lib/constants'
import { todayISO } from '@/lib/date'
import { createDefaultState, parseFinanceState } from '@/schemas/finance.schema'
import { migrate } from '@/schemas/migrations'
import type { FinanceState } from '@/types/finance'

export type StorageSerializer<T> = Serializer<T>

const CORRUPT_BACKUP_KEY = 'boleh-beli:state:corrupt'

function backupCorruptState(raw: string): void {
  if (typeof localStorage !== 'undefined') {
    try {
      localStorage.setItem(CORRUPT_BACKUP_KEY, raw)
    } catch {
      // fail-soft if storage quota or access is restricted
    }
  }
}

export function restoreState(raw: string | null | undefined, today: string): FinanceState {
  if (!raw || typeof raw !== 'string' || !raw.trim()) {
    return createDefaultState(today)
  }

  let parsed: unknown
  try {
    parsed = JSON.parse(raw)
  } catch {
    backupCorruptState(raw)
    return createDefaultState(today)
  }

  const isEnvelope =
    parsed !== null &&
    typeof parsed === 'object' &&
    typeof (parsed as Record<string, unknown>).version === 'number' &&
    'data' in (parsed as Record<string, unknown>)

  const version = isEnvelope ? ((parsed as Record<string, unknown>).version as number) : 0
  const data = isEnvelope ? (parsed as Record<string, unknown>).data : parsed

  const migratedData = migrate(version, data)
  return parseFinanceState(migratedData, today)
}

export const financeSerializer: StorageSerializer<FinanceState> = {
  read: (raw: string) => restoreState(raw, todayISO()),
  write: (state: FinanceState) => JSON.stringify({ version: SCHEMA_VERSION, data: state }),
}
