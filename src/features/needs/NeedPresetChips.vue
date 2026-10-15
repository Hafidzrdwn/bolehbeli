<script setup lang="ts">
import { NEED_PRESETS, type NeedPreset } from '@/lib/finance/presets'

interface Props {
  activePresetId?: string
}

defineProps<Props>()

const emit = defineEmits<{
  (e: 'select', preset: NeedPreset): void
}>()
</script>

<template>
  <div class="flex items-center gap-1.5 overflow-x-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden py-0.5">
    <button
      v-for="preset in NEED_PRESETS"
      :key="preset.id"
      type="button"
      :aria-pressed="activePresetId === preset.id"
      :class="[
        'relative inline-flex h-9 shrink-0 items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors select-none before:absolute before:inset-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:h-11 before:w-full',
        activePresetId === preset.id
          ? 'bg-primary text-primary-foreground font-semibold'
          : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground',
      ]"
      @click="emit('select', preset)"
    >
      <component :is="preset.icon" class="size-3.5" aria-hidden="true" />
      <span>{{ preset.label }}</span>
    </button>
  </div>
</template>
