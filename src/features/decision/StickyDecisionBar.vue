<script setup lang="ts">
import { computed, toRef } from 'vue'
import { storeToRefs } from 'pinia'
import { useElementVisibility } from '@vueuse/core'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import { formatIDR } from '@/lib/money'
import { useFinanceStore } from '@/stores/finance'

interface Props {
  target?: HTMLElement | null
}

const props = withDefaults(defineProps<Props>(), {
  target: null,
})

const targetRef = toRef(props, 'target')
const isHubVisible = useElementVisibility(targetRef)

const store = useFinanceStore()
const { decisionResult } = storeToRefs(store)

const isVisible = computed(() => {
  return decisionResult.value.hasSelection && !isHubVisible.value
})

function handleTap() {
  if (!props.target) return
  const isReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  props.target.scrollIntoView({
    behavior: isReducedMotion ? 'auto' : 'smooth',
    block: 'start',
  })
}
</script>

<template>
  <Transition name="slide-up">
    <div
      v-if="isVisible"
      role="region"
      aria-label="Ringkasan keputusan cepat"
      class="pointer-events-none fixed inset-x-0 bottom-0 z-40 mx-auto w-full max-w-xl px-4 pb-[calc(0.75rem+env(safe-area-inset-bottom))] pt-2"
    >
      <button
        type="button"
        aria-label="Gulir ke rincian keputusan di Decision Hub"
        class="pointer-events-auto flex w-full items-center justify-between gap-3 rounded-2xl border border-border/80 bg-card/95 p-3.5 shadow-lg backdrop-blur-md transition-transform motion-safe:active:scale-[0.98] text-left hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        @click="handleTap"
      >
        <div class="flex items-center gap-3 min-w-0">
          <span class="text-2xl select-none shrink-0" aria-hidden="true">
            {{ decisionResult.message.emoji }}
          </span>
          <div class="min-w-0">
            <p class="truncate text-sm font-bold text-foreground leading-tight">
              {{ decisionResult.message.headline }}
            </p>
            <p class="text-xs text-muted-foreground truncate">
              Jatah:
              <span class="font-semibold text-foreground">{{
                formatIDR(decisionResult.dailyFinal)
              }}</span>/hari
            </p>
          </div>
        </div>

        <div class="shrink-0">
          <StatusBadge :status="decisionResult.status" />
        </div>
      </button>
    </div>
  </Transition>
</template>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition:
    transform 200ms ease,
    opacity 200ms ease;
}
.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
