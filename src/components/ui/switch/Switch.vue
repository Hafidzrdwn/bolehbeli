<script setup lang="ts">
import type { HTMLAttributes } from 'vue'
import { computed } from 'vue'
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  checked?: boolean
  modelValue?: boolean
  disabled?: boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  checked: undefined,
  modelValue: undefined,
  disabled: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'update:checked', value: boolean): void
}>()

const isChecked = computed(() => {
  if (typeof props.checked === 'boolean') return props.checked
  if (typeof props.modelValue === 'boolean') return props.modelValue
  return false
})

function handleClick() {
  if (props.disabled) return
  const next = !isChecked.value
  emit('update:modelValue', next)
  emit('update:checked', next)
}
</script>

<template>
  <button
    :id="id"
    type="button"
    role="switch"
    data-slot="switch"
    :aria-checked="isChecked"
    :disabled="disabled"
    :data-state="isChecked ? 'checked' : 'unchecked'"
    :class="
      cn(
        'peer relative inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-foreground/15 before:absolute before:inset-1/2 before:-translate-x-1/2 before:-translate-y-1/2 before:size-11 before:content-[\'\']',
        props.class,
      )
    "
    @click="handleClick"
  >
    <span
      data-slot="switch-thumb"
      :data-state="isChecked ? 'checked' : 'unchecked'"
      class="pointer-events-none block size-5 rounded-full bg-white transition-transform data-[state=checked]:translate-x-5.5 data-[state=unchecked]:translate-x-0.5"
    />
  </button>
</template>
