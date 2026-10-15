<script setup lang="ts">
import { useUndo } from '@/composables/useUndo'

const { currentEntry, pause, resume, undo } = useUndo()
</script>

<template>
  <aside
    aria-label="Pemberitahuan urungkan"
    class="pointer-events-none fixed inset-x-0 bottom-20 sm:bottom-24 z-50 px-4"
  >
    <Transition name="snackbar-fade">
      <div
        v-if="currentEntry"
        role="status"
        aria-live="polite"
        class="pointer-events-auto mx-auto flex max-w-sm items-center justify-between rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background shadow-lg dark:ring-1 dark:ring-white/10"
        @pointerenter="pause"
        @pointerleave="resume"
        @focusin="pause"
        @focusout="resume"
      >
        <span class="truncate">{{ currentEntry.message }}</span>
        <button
          type="button"
          class="ml-3 shrink-0 font-bold underline transition-opacity hover:opacity-85 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-xs"
          @click="undo"
        >
          Urungkan
        </button>
      </div>
    </Transition>
  </aside>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .snackbar-fade-enter-active,
  .snackbar-fade-leave-active {
    transition:
      opacity 150ms ease-out,
      transform 150ms ease-out;
  }
  .snackbar-fade-enter-from {
    opacity: 0;
    transform: translateY(8px);
  }
  .snackbar-fade-leave-to {
    opacity: 0;
    transform: translateY(8px);
  }
}
</style>
