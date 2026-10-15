<script setup lang="ts">
import { inject, type Ref } from 'vue'

const open = inject<Ref<boolean>>('popover-open')

function close(): void {
  if (open) {
    open.value = false
  }
}
</script>

<template>
  <button type="button" data-slot="popover-close" @click="close">
    <slot />
  </button>
</template>
