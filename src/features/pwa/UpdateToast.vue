<script setup lang="ts">
import { watch } from 'vue'
import { CheckCircle2, RefreshCw } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { usePwaUpdate } from '@/composables/usePwaUpdate'

const { needRefresh, offlineReady, updateServiceWorker } = usePwaUpdate()

watch(
  offlineReady,
  (val) => {
    if (val) {
      setTimeout(() => {
        offlineReady.value = false
      }, 4000)
    }
  },
  { immediate: true },
)

function onRefresh() {
  updateServiceWorker(true)
}

function onLater() {
  needRefresh.value = false
}
</script>

<template>
  <aside
    role="status"
    aria-live="polite"
    aria-atomic="true"
    class="pointer-events-none fixed inset-x-0 bottom-20 z-50 mx-auto w-full max-w-xl px-4"
  >
    <Transition name="toast-fade">
      <div
        v-if="needRefresh"
        class="pointer-events-auto flex items-center justify-between gap-3 rounded-xl border border-primary/30 bg-card/95 p-3.5 shadow-xl backdrop-blur-md"
      >
        <div class="flex items-center gap-3 min-w-0">
          <div
            class="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary"
            aria-hidden="true"
          >
            <RefreshCw class="size-4 animate-spin" />
          </div>
          <div class="min-w-0 text-xs">
            <p class="font-semibold text-foreground">
              Versi baru tersedia
            </p>
            <p class="text-muted-foreground truncate">
              Muat ulang untuk menerapkan pembaruan.
            </p>
          </div>
        </div>

        <div class="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            class="h-8 px-2.5 text-xs text-muted-foreground"
            @click="onLater"
          >
            Nanti
          </Button>
          <Button
            size="sm"
            class="h-8 px-3 text-xs"
            @click="onRefresh"
          >
            Muat ulang
          </Button>
        </div>
      </div>

      <div
        v-else-if="offlineReady"
        class="pointer-events-auto flex items-center gap-3 rounded-xl border border-safe/30 bg-safe/10 p-3 shadow-lg backdrop-blur-md text-xs text-safe-foreground"
      >
        <CheckCircle2 class="size-4 shrink-0" aria-hidden="true" />
        <p class="font-medium">
          Aplikasi siap digunakan secara offline.
        </p>
      </div>
    </Transition>
  </aside>
</template>

<style scoped>
.toast-fade-enter-active,
.toast-fade-leave-active {
  transition:
    opacity 200ms ease,
    transform 200ms ease;
}
.toast-fade-enter-from,
.toast-fade-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
