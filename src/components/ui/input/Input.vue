<script setup lang="ts">
import { ref, type HTMLAttributes } from 'vue'
import { cn } from '@/lib/utils'

const props = defineProps<{
  defaultValue?: string | number
  class?: HTMLAttributes['class']
}>()

const modelValue = defineModel<string | number>()
const inputRef = ref<HTMLInputElement | null>(null)

defineExpose({
  focus: () => inputRef.value?.focus(),
  $el: inputRef,
})
</script>

<template>
  <input
    ref="inputRef"
    v-model="modelValue"
    data-slot="input"
    :class="cn(
      'field h-11 pointer-fine:h-10 w-full min-w-0 px-3.5 py-2 text-base aria-invalid:ring-2 aria-invalid:ring-destructive disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
      props.class,
    )"
  >
</template>
