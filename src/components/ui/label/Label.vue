<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  for?: string
  class?: HTMLAttributes['class']
}>()
</script>

<template>
  <label
    data-slot="label"
    :for="props.for"
    :class="
      cn(
        'gap-2 text-sm leading-none font-medium group-data-[disabled=true]:opacity-50 peer-disabled:opacity-50 flex items-center select-none group-data-[disabled=true]:pointer-events-none peer-disabled:cursor-not-allowed',
        props.class,
      )
    "
  >
    <slot />
  </label>
</template>
