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
  <div
    class="flex flex-col items-center justify-center rounded-xl border border-dashed border-border/70 bg-card/40 p-6 text-center"
  >
    <div
      v-if="icon"
      class="mb-3 flex size-10 items-center justify-center rounded-full bg-muted/60 text-muted-foreground"
      aria-hidden="true"
    >
      <component :is="icon" class="size-5" />
    </div>

    <h3 class="text-sm font-semibold text-foreground">
      {{ title }}
    </h3>

    <p v-if="description" class="mt-1 max-w-xs text-xs text-muted-foreground">
      {{ description }}
    </p>

    <div v-if="$slots.action" class="mt-3">
      <slot name="action" />
    </div>
  </div>
</template>
