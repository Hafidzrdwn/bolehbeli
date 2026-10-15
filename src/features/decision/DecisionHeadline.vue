<script setup lang="ts">
import { computed } from 'vue'
import type { DecisionTone } from './status-theme'

interface Props {
  tone: DecisionTone
  emoji: string
  headline: string
  detail: string
}

const props = defineProps<Props>()

const pillConfig = computed(() => {
  switch (props.tone) {
    case 'safe':
      return {
        label: 'Gas beli',
        class: 'bg-safe/15 text-safe-foreground',
      }
    case 'warning':
      return {
        label: 'Tahan dulu',
        class: 'bg-warning/15 text-warning-foreground',
      }
    case 'danger':
      return {
        label: 'Bahaya',
        class: 'bg-danger/15 text-danger-foreground',
      }
    default:
      return {
        label: 'Simulasi',
        class: 'bg-muted text-muted-foreground',
      }
  }
})
</script>

<template>
  <div class="flex flex-col gap-2.5">
    <div class="flex items-center">
      <span
        class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold"
        :class="pillConfig.class"
      >
        <span aria-hidden="true" class="select-none">{{ emoji }}</span>
        <span>{{ pillConfig.label }}</span>
      </span>
    </div>

    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      class="min-w-0"
    >
      <Transition name="headline-fade" mode="out-in">
        <div :key="`${tone}-${headline}`" class="space-y-1">
          <h2 class="text-title font-semibold text-foreground">
            {{ headline }}
          </h2>
          <p class="text-body text-muted-foreground">
            {{ detail }}
          </p>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .headline-fade-enter-active,
  .headline-fade-leave-active {
    transition:
      opacity 120ms ease-out,
      transform 120ms ease-out;
  }
  .headline-fade-enter-from {
    opacity: 0;
    transform: translateY(2px);
  }
  .headline-fade-leave-to {
    opacity: 0;
    transform: translateY(-2px);
  }
}
</style>
