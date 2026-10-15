<script setup lang="ts">
import { defineAsyncComponent, ref } from 'vue'
import { Settings } from '@lucide/vue'
import ThemeToggle from '@/components/shared/ThemeToggle.vue'

const SettingsDialog = defineAsyncComponent(
  () => import('@/features/settings/SettingsDialog.vue'),
)

const isLoaded = ref(false)
const isSettingsOpen = ref(false)

function openSettings() {
  isLoaded.value = true
  isSettingsOpen.value = true
}
</script>

<template>
  <header class="flex items-center justify-between py-2">
    <div>
      <h1 class="text-2xl font-bold tracking-tight text-foreground">
        BolehBeli?
      </h1>
      <p class="text-xs text-muted-foreground">
        Kalkulator keputusan belanja cerdas
      </p>
    </div>
    <div class="flex items-center gap-2">
      <button
        type="button"
        aria-label="Buka pengaturan"
        class="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        @click="openSettings"
      >
        <Settings class="size-4" />
      </button>
      <ThemeToggle />
    </div>

    <SettingsDialog
      v-if="isLoaded"
      v-model:open="isSettingsOpen"
    />
  </header>
</template>
