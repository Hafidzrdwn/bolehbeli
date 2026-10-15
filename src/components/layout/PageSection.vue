<script setup lang="ts">
import { useId } from 'vue'

interface Props {
  title?: string
  id?: string
}

const props = defineProps<Props>()
const generatedId = useId()
const headingId = props.id || generatedId
</script>

<template>
  <section :aria-labelledby="title ? headingId : undefined" class="w-full space-y-3">
    <div v-if="title || $slots.meta || $slots.action" class="flex items-center justify-between gap-3">
      <h2 v-if="title" :id="headingId" class="text-section-label select-none">
        {{ title }}
      </h2>
      <div v-else />

      <div v-if="$slots.meta || $slots.action" class="flex items-center gap-2">
        <slot name="meta" />
        <slot name="action" />
      </div>
    </div>

    <div>
      <slot />
    </div>
  </section>
</template>
