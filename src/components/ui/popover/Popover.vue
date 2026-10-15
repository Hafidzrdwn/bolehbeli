<script setup lang="ts">
import { provide } from 'vue'

const open = defineModel<boolean>('open', { default: false })
provide('popover-open', open)
</script>

<template>
  <div class="relative inline-block" data-slot="popover">
    <slot :open="open" />
  </div>
</template>
