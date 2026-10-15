<script setup lang="ts">
import { inject, type Ref } from 'vue'

withDefaults(
  defineProps<{
    asChild?: boolean
  }>(),
  {
    asChild: false,
  },
)

const open = inject<Ref<boolean>>('popover-open')

function toggle(): void {
  if (open) {
    open.value = !open.value
  }
}
</script>

<template>
  <div data-slot="popover-trigger" class="inline-flex" @click="toggle">
    <slot />
  </div>
</template>
