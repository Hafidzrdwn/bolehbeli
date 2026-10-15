<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  title: string
  description?: string
  id?: string
  class?: string
}

const props = defineProps<Props>()
const generatedId = useId()
const headingId = props.id || generatedId

defineExpose({ headingId })
</script>

<template>
  <div
    :aria-labelledby="headingId"
    class="border border-border/50 bg-card/80 rounded-2xl overflow-hidden"
    :class="props.class"
  >
    <div class="flex flex-row items-start justify-between gap-4 p-4 pb-2 sm:p-5 sm:pb-3">
      <div class="space-y-1">
        <h2 :id="headingId" class="text-base font-semibold tracking-tight sm:text-lg">
          {{ title }}
        </h2>
        <p v-if="description" class="text-xs text-muted-foreground sm:text-sm">
          {{ description }}
        </p>
      </div>
      <div v-if="$slots.action" class="shrink-0">
        <slot name="action" />
      </div>
    </div>
    <div class="p-4 pt-2 sm:p-5 sm:pt-3">
      <slot />
    </div>
  </div>
</template>
