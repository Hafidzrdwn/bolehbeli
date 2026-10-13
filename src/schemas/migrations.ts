import { SCHEMA_VERSION } from '@/lib/constants'

export type MigrationFn = (data: unknown) => unknown

export const migrations: Record<number, MigrationFn> = {
  // Empty for v1: key n migrates from vn -> vn+1
}

export function migrate(fromVersion: number, data: unknown): unknown {
  let currentVersion = fromVersion
  let currentData = data

  while (currentVersion < SCHEMA_VERSION) {
    const migration = migrations[currentVersion]
    if (typeof migration === 'function') {
      currentData = migration(currentData)
    }
    currentVersion++
  }

  return currentData
}
