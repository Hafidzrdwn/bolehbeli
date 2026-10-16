<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Download, Share2, X } from '@lucide/vue'
import { Button } from '@/components/ui/button'
import { useInstallPrompt } from '@/composables/useInstallPrompt'

const { canInstall, isIos, isStandalone, install, dismiss } = useInstallPrompt()

const isIdle = ref(false)

onMounted(() => {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(() => {
      isIdle.value = true
    })
  } else {
    setTimeout(() => {
      isIdle.value = true
    }, 600)
  }
})

const showBanner = computed(() => isIdle.value && canInstall.value && !isStandalone.value)
</script>

<template>
  <Transition name="fade-slide">
    <aside
      v-if="showBanner"
      role="region"
      aria-label="Ajakan pasang aplikasi"
      class="fixed top-3 left-4 right-4 z-50 mx-auto max-w-xl flex items-center justify-between gap-3 rounded-xl border border-primary/25 bg-card/95 p-3.5 text-foreground shadow-lg hairline"
    >
      <div class="flex items-center gap-3 min-w-0">
        <div
          class="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary"
          aria-hidden="true"
        >
          <Share2 v-if="isIos" class="size-4" />
          <Download v-else class="size-4" />
        </div>

        <div class="min-w-0 text-xs">
          <p class="font-semibold text-foreground">
            Pasang BolehBeli?
          </p>
          <p v-if="isIos" class="text-muted-foreground">
            Ketuk <span class="font-medium text-foreground">Bagikan</span> lalu pilih
            <span class="font-medium text-foreground">Tambahkan ke Layar Utama</span>.
          </p>
          <p v-else class="text-muted-foreground truncate">
            Akses kalkulator langsung dari layar utama secara offline.
          </p>
        </div>
      </div>

      <div class="flex items-center gap-1.5 shrink-0">
        <Button
          v-if="!isIos"
          size="sm"
          class="h-8 px-3 text-xs"
          @click="install"
        >
          Pasang
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Tutup ajakan pasang"
          class="size-8 text-muted-foreground hover:text-foreground"
          @click="dismiss"
        >
          <X class="size-4" />
        </Button>
      </div>
    </aside>
  </Transition>
</template>

<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 180ms ease,
    transform 180ms ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
