import {
  AlertTriangle,
  Bus,
  Receipt,
  Utensils,
} from '@lucide/vue'
import type { ExpenseCategory } from '@/types/finance'

import type { Component } from 'vue'

export interface NeedPreset {
  id: string
  label: string
  category: ExpenseCategory
  icon: Component
}

export interface CategoryMeta {
  label: string
  icon: Component
}

export const CATEGORY_META: Record<ExpenseCategory, CategoryMeta> = {
  food: {
    label: 'Makan',
    icon: Utensils,
  },
  transport: {
    label: 'Transport',
    icon: Bus,
  },
  bill: {
    label: 'Tagihan',
    icon: Receipt,
  },
  other: {
    label: 'Lainnya',
    icon: Receipt,
  },
}

export const NEED_PRESETS: readonly NeedPreset[] = [
  {
    id: 'food',
    label: 'Makan',
    category: 'food',
    icon: Utensils,
  },
  {
    id: 'transport',
    label: 'Transport',
    category: 'transport',
    icon: Bus,
  },
  {
    id: 'bill',
    label: 'Tagihan',
    category: 'bill',
    icon: Receipt,
  },
  {
    id: 'buffer',
    label: 'Buffer Darurat',
    category: 'other',
    icon: AlertTriangle,
  },
] as const
