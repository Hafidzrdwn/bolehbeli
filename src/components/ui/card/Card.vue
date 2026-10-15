<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'border border-border/50 bg-card text-card-foreground overflow-hidden rounded-2xl p-4 md:p-5 text-sm flex flex-col',
        props.class,
      )
    "
  >
    <slot />
  </div>
</template>
