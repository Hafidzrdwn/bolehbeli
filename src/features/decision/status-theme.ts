import type { DecisionStatus } from '@/types/finance'

export type DecisionTone = DecisionStatus | 'idle'

export interface StatusThemeConfig {
  bannerClass: string
  headlineClass: string
  detailClass: string
}

export const STATUS_THEME_MAP: Record<DecisionTone, StatusThemeConfig> = {
  idle: {
    bannerClass: 'bg-muted/50 border-border text-foreground',
    headlineClass: 'text-foreground',
    detailClass: 'text-muted-foreground',
  },
  safe: {
    bannerClass: 'bg-safe/15 border-safe text-safe-foreground',
    headlineClass: 'text-safe-foreground',
    detailClass: 'text-safe-foreground/90',
  },
  warning: {
    bannerClass: 'bg-warning/15 border-warning text-warning-foreground',
    headlineClass: 'text-warning-foreground',
    detailClass: 'text-warning-foreground/90',
  },
  danger: {
    bannerClass: 'bg-danger/15 border-danger text-danger-foreground',
    headlineClass: 'text-danger-foreground',
    detailClass: 'text-danger-foreground/90',
  },
}
