<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { ChevronUp } from '@lucide/vue'
import { formatCompactIDR } from '@/lib/money'
import { useFinanceStore } from '@/stores/finance'

const emit = defineEmits<{
  (e: 'open'): void
}>()

const store = useFinanceStore()
const { decisionResult } = storeToRefs(store)

const dotClass = computed(() => {
  switch (decisionResult.value.message.tone) {
    case 'safe':
      return 'bg-safe'
    case 'warning':
      return 'bg-warning'
    case 'danger':
      return 'bg-danger'
    default:
      return 'bg-primary'
  }
})

const buttonLabel = computed(
  () => `Lihat hasil: ${decisionResult.value.message.headline}`,
)
</script>

<template>
  <aside
    aria-label="Keputusan melayang"
    class="pointer-events-none fixed inset-x-0 bottom-0 z-40 p-3 sm:p-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
  >
    <div class="pointer-events-auto mx-auto max-w-xl">
      <button
        type="button"
        :aria-label="buttonLabel"
        class="flex h-14 sm:h-16 w-full items-center justify-between rounded-2xl bg-card/95 backdrop-blur-md px-4 sm:px-5 text-left hairline shadow-[0_8px_30px_-12px_rgb(0_0_0/.25)] dark:shadow-none dark:ring-1 dark:ring-white/10 hover:bg-card transition-all active:scale-[0.99] outline-none focus-visible:ring-2 focus-visible:ring-ring"
        @click="emit('open')"
      >
        <div class="flex items-center gap-2.5 min-w-0" aria-hidden="true">
          <span class="size-2.5 rounded-full shrink-0" :class="dotClass" />
          <span class="font-medium text-foreground truncate text-sm sm:text-base">
            {{ decisionResult.message.headline }}
          </span>
          <span class="text-muted-foreground text-sm shrink-0">·</span>
          <span class="font-semibold tabular-nums text-foreground text-sm sm:text-base shrink-0">
            {{ formatCompactIDR(decisionResult.dailyFinal) }}/hari
          </span>
        </div>

        <ChevronUp class="size-5 text-muted-foreground shrink-0 ml-2" aria-hidden="true" />
      </button>
    </div>
  </aside>
</template>
