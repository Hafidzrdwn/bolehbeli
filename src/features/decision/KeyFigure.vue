<script setup lang="ts">
import { computed } from 'vue'
import { formatIDR } from '@/lib/money'
import type { DecisionTone } from './status-theme'

interface Props {
  daily0: number
  dailyFinal: number
  dailyDrop: number
  dailyDropPercent: number
  hasSelection: boolean
  tone: DecisionTone
}

const props = defineProps<Props>()

const diffChipClass = computed(() => {
  if (props.tone === 'danger') return 'bg-danger/15 text-danger-foreground'
  if (props.tone === 'warning') return 'bg-warning/15 text-warning-foreground'
  return 'bg-safe/15 text-safe-foreground'
})
</script>

<template>
  <div class="space-y-1">
    <span class="text-label uppercase tracking-wider text-muted-foreground">
      Jatah per hari
    </span>

    <div class="flex items-baseline gap-2 flex-wrap">
      <span class="text-display font-semibold text-foreground tabular-nums">
        {{ formatIDR(dailyFinal) }}
      </span>
      <span class="text-meta text-muted-foreground font-medium">/hari</span>
    </div>

    <div
      v-if="hasSelection && dailyDrop > 0"
      class="flex items-center gap-2 pt-0.5 text-xs"
    >
      <span class="line-through text-muted-foreground tabular-nums">
        {{ formatIDR(daily0) }}/hari
      </span>
      <span
        class="inline-flex items-center rounded-full px-2 py-0.5 font-semibold tabular-nums"
        :class="diffChipClass"
      >
        −{{ dailyDropPercent }}%
      </span>
    </div>
  </div>
</template>
