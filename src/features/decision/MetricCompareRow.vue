<script setup lang="ts">
import { computed } from 'vue'
import MoneyText from '@/components/shared/MoneyText.vue'

interface Props {
  label: string
  from: number
  to?: number
  diffText?: string
  tone?: 'safe' | 'warning' | 'danger' | 'neutral'
  hasSelection?: boolean
  unit?: string
}

const props = withDefaults(defineProps<Props>(), {
  to: undefined,
  diffText: undefined,
  tone: 'neutral',
  hasSelection: false,
  unit: undefined,
})

const badgeClass = computed(() => {
  switch (props.tone) {
    case 'safe':
      return 'bg-safe/15 text-safe-foreground border border-safe/30'
    case 'warning':
      return 'bg-warning/15 text-warning-foreground border border-warning/30'
    case 'danger':
      return 'bg-danger/15 text-danger-foreground border border-danger/30'
    default:
      return 'bg-muted text-muted-foreground border border-border/50'
  }
})
</script>

<template>
  <div
    class="flex flex-col gap-1.5 py-2.5 sm:flex-row sm:items-center sm:justify-between border-b border-border/50 last:border-b-0"
  >
    <span class="text-sm font-medium text-muted-foreground">{{ label }}</span>

    <div class="flex flex-wrap items-center gap-2">
      <template v-if="hasSelection && to !== undefined">
        <div class="flex items-center gap-1.5 text-sm">
          <MoneyText :value="from" class="text-muted-foreground" />
          <span class="text-muted-foreground select-none" aria-hidden="true">→</span>
          <MoneyText :value="to" class="font-bold text-foreground" />
          <span v-if="unit" class="text-xs text-muted-foreground">{{ unit }}</span>
        </div>

        <span
          v-if="diffText"
          class="rounded-md px-1.5 py-0.5 text-xs font-semibold"
          :class="badgeClass"
        >
          {{ diffText }}
        </span>
      </template>

      <template v-else>
        <div class="flex items-center gap-1 text-sm font-bold text-foreground">
          <MoneyText :value="from" />
          <span v-if="unit" class="text-xs font-normal text-muted-foreground">{{ unit }}</span>
        </div>
      </template>
    </div>
  </div>
</template>
