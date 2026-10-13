import type { Component } from 'vue'
import { AlertTriangle, CheckCircle2, XCircle } from '@lucide/vue'
import type { DecisionStatus } from '@/types/finance'

export interface StatusConfig {
  label: string
  variant: 'safe' | 'warning' | 'danger'
  icon: Component
}

export const STATUS_CONFIG_MAP: Record<DecisionStatus, StatusConfig> = {
  safe: {
    label: 'Gas beli',
    variant: 'safe',
    icon: CheckCircle2,
  },
  warning: {
    label: 'Tahan dulu',
    variant: 'warning',
    icon: AlertTriangle,
  },
  danger: {
    label: 'Bahaya',
    variant: 'danger',
    icon: XCircle,
  },
}
