<script setup lang="ts">
import type { Component } from 'vue'

interface Props {
  icon?: Component
  title: string
  description?: string
}

defineProps<Props>()
</script>

<template>
  <div class="flex items-center gap-3 py-3 px-2 text-muted-foreground select-none">
    <div
      v-if="icon"
      class="flex size-7 shrink-0 items-center justify-center rounded-full bg-muted/60 text-muted-foreground"
      aria-hidden="true"
    >
      <component :is="icon" class="size-3.5" />
    </div>

    <div class="min-w-0 flex-1 text-xs">
      <span class="font-medium text-foreground/80">{{ title }}</span>
      <span v-if="description" class="ml-1 text-muted-foreground">· {{ description }}</span>
    </div>

    <div v-if="$slots.action" class="shrink-0">
      <slot name="action" />
    </div>
  </div>
</template>
