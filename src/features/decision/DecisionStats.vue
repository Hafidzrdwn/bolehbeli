<script setup lang="ts">
import { computed } from 'vue'
import { formatIDR } from '@/lib/money'
import type { DecisionTone } from './status-theme'

interface Props {
  sisaLabel: string
  sisa0: number
  sisaFinal: number
  buffer: number
  hasSelection: boolean
  tone: DecisionTone
}

const props = defineProps<Props>()

const sisaColorClass = computed(() => {
  if (props.sisaFinal < 0) return 'text-danger-foreground'
  if (props.sisaFinal < props.buffer) return 'text-warning-foreground'
  return 'text-foreground'
})
</script>

<template>
  <div class="grid grid-cols-2 gap-3 pt-3 border-t hairline">
    <div class="flex flex-col gap-1 min-w-0">
      <span class="text-label uppercase tracking-wider text-muted-foreground truncate">
        {{ sisaLabel }}
      </span>

      <div v-if="hasSelection" class="flex items-baseline gap-1.5 flex-wrap">
        <span class="line-through text-muted-foreground text-xs tabular-nums">
          {{ formatIDR(sisa0) }}
        </span>
        <span class="font-semibold text-sm tabular-nums" :class="sisaColorClass">
          {{ formatIDR(sisaFinal) }}
        </span>
      </div>

      <span v-else class="font-semibold text-sm text-foreground tabular-nums">
        {{ formatIDR(sisaFinal) }}
      </span>
    </div>

    <div class="flex flex-col gap-1 min-w-0">
      <span class="text-label uppercase tracking-wider text-muted-foreground truncate">
        Buffer
      </span>
      <span class="font-semibold text-sm text-foreground tabular-nums">
        {{ formatIDR(buffer) }}
      </span>
    </div>
  </div>
</template>
