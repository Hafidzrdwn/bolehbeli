<script setup lang="ts">
import { NEED_PRESETS, type NeedPreset } from '@/lib/finance/presets'
import { cn } from '@/lib/utils'

interface Props {
  activePresetId?: string
}

defineProps<Props>()

const emits = defineEmits<{
  (e: 'select', preset: NeedPreset): void
}>()
</script>

<template>
  <div class="flex flex-wrap items-center gap-2">
    <span class="text-xs text-muted-foreground">Kategori cepat:</span>
    <button
      v-for="preset in NEED_PRESETS"
      :key="preset.id"
      type="button"
      :aria-pressed="activePresetId === preset.id"
      :class="
        cn(
          'flex h-8 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-colors select-none',
          activePresetId === preset.id
            ? 'border-primary bg-primary/10 text-primary font-semibold'
            : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
        )
      "
      @click="emits('select', preset)"
    >
      <component :is="preset.icon" class="size-3.5" aria-hidden="true" />
      <span>{{ preset.label }}</span>
    </button>
  </div>
</template>
