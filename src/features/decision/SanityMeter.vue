<script setup lang="ts">
import { computed } from 'vue'
import type { AllocationResult } from '@/lib/finance/allocation'
import { formatIDR } from '@/lib/money'

interface Props {
  allocation: AllocationResult
  buffer: number
}

const props = defineProps<Props>()

const ariaLabel = computed(() => {
  if (props.allocation.deficit) {
    return `Kebutuhan ${props.allocation.needsPct}%, belanja ${props.allocation.wishlistPct}%, defisit ${formatIDR(props.allocation.shortfall)}`
  }
  return `Kebutuhan ${props.allocation.needsPct}%, belanja ${props.allocation.wishlistPct}%, sisa ${props.allocation.remainingPct}% dari saldo`
})
</script>

<template>
  <div class="space-y-3">
    <div
      role="img"
      :aria-label="ariaLabel"
      class="relative flex h-2 w-full overflow-hidden rounded-full bg-muted/70 [&>div]:h-full [&>div]:transition-[width] [&>div]:motion-safe:duration-200"
    >
      <div
        v-if="allocation.needsPct > 0"
        class="bg-muted-foreground/80"
        :style="{ width: `${allocation.needsPct}%` }"
        :title="`Kebutuhan: ${allocation.needsPct}%`"
      />

      <div
        v-if="allocation.wishlistPct > 0"
        class="bg-primary"
        :style="{ width: `${allocation.wishlistPct}%` }"
        :title="`Belanja: ${allocation.wishlistPct}%`"
      />

      <div
        v-if="!allocation.deficit && allocation.remainingPct > 0"
        class="bg-safe"
        :style="{ width: `${allocation.remainingPct}%` }"
        :title="`Sisa: ${allocation.remainingPct}%`"
      />

      <div
        v-if="allocation.deficit"
        class="bg-danger"
        :style="{ width: '100%' }"
        :title="`Defisit: ${formatIDR(allocation.shortfall)}`"
      />

      <div
        v-if="allocation.bufferMarkerPct > 0 && allocation.bufferMarkerPct < 100"
        class="absolute top-0 bottom-0 z-10 w-0.5 bg-foreground/90"
        :style="{ left: `${allocation.bufferMarkerPct}%` }"
        aria-hidden="true"
        :title="`Batas Buffer: ${formatIDR(buffer)}`"
      />
    </div>

    <div
      class="flex flex-wrap items-center justify-between gap-x-4 gap-y-1.5 text-xs text-muted-foreground"
    >
      <div class="flex flex-wrap items-center gap-x-3 gap-y-1">
        <span class="inline-flex items-center gap-1.5">
          <span class="size-2 rounded-full bg-muted-foreground/80" aria-hidden="true" />
          <span>Kebutuhan {{ allocation.needsPct }}%</span>
        </span>

        <span class="inline-flex items-center gap-1.5">
          <span class="size-2 rounded-full bg-primary" aria-hidden="true" />
          <span>Belanja {{ allocation.wishlistPct }}%</span>
        </span>

        <span v-if="!allocation.deficit" class="inline-flex items-center gap-1.5">
          <span class="size-2 rounded-full bg-safe" aria-hidden="true" />
          <span>Sisa {{ allocation.remainingPct }}%</span>
        </span>

        <span
          v-else
          class="inline-flex items-center gap-1.5 font-semibold text-danger-foreground"
        >
          <span class="size-2 rounded-full bg-danger" aria-hidden="true" />
          <span>Kurang {{ formatIDR(allocation.shortfall) }}</span>
        </span>
      </div>

      <span v-if="buffer > 0" class="inline-flex items-center gap-1 text-muted-foreground">
        <span class="inline-block h-2.5 w-0.5 bg-foreground/80" aria-hidden="true" />
        <span>Buffer: {{ formatIDR(buffer) }}</span>
      </span>
    </div>
  </div>
</template>
