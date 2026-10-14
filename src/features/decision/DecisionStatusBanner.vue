<script setup lang="ts">
import { computed } from 'vue'
import StatusBadge from '@/components/shared/StatusBadge.vue'
import { STATUS_THEME_MAP } from '@/features/decision/status-theme'
import type { DecisionMessage, DecisionStatus } from '@/types/finance'

interface Props {
  status: DecisionStatus
  message: DecisionMessage
}

const props = defineProps<Props>()

const theme = computed(() => STATUS_THEME_MAP[props.status])
</script>

<template>
  <Transition name="banner-fade" mode="out-in">
    <div
      :key="`${status}-${message.headline}`"
      role="status"
      aria-live="polite"
      aria-atomic="true"
      class="flex items-start justify-between gap-3 rounded-xl border p-4 transition-colors"
      :class="theme.bannerClass"
    >
      <div class="flex items-start gap-3 min-w-0">
        <span
          aria-hidden="true"
          class="shrink-0 select-none text-2xl leading-none sm:text-3xl"
        >
          {{ message.emoji }}
        </span>
        <div class="space-y-1 min-w-0">
          <h3
            class="text-base font-bold leading-tight sm:text-lg"
            :class="theme.headlineClass"
          >
            {{ message.headline }}
          </h3>
          <p
            class="text-xs leading-relaxed sm:text-sm"
            :class="theme.detailClass"
          >
            {{ message.detail }}
          </p>
        </div>
      </div>

      <div class="shrink-0">
        <StatusBadge :status="status" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.banner-fade-enter-active,
.banner-fade-leave-active {
  transition:
    opacity 150ms ease,
    transform 150ms ease;
}
.banner-fade-enter-from {
  opacity: 0;
  transform: translateY(4px);
}
.banner-fade-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
