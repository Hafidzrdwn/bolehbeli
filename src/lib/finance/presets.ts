import type { Component } from 'vue'
import {
  Bus,
  MoreHorizontal,
  Receipt,
  ShieldAlert,
  Utensils,
} from '@lucide/vue'
import type { ExpenseCategory } from '@/types/finance'

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
    icon: MoreHorizontal,
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
    icon: ShieldAlert,
  },
] as const
