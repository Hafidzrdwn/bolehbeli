<script setup lang="ts">
import { useRupiahInput } from '@/composables/useRupiahInput'
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  placeholder: '0',
  invalid: false,
  disabled: false,
  class: undefined,
})

const modelValue = defineModel<number | null>({ default: null })

const { displayValue, handleInput } = useRupiahInput(
  modelValue,
  (val) => {
    modelValue.value = val
  },
)
</script>

<template>
  <div
    :class="
      cn(
        'group flex h-11 w-full items-center rounded-lg border bg-background px-3 transition-colors',
        'border-input focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/50',
        invalid && 'border-danger focus-within:border-danger focus-within:ring-danger/40',
        disabled && 'cursor-not-allowed opacity-50',
        props.class,
      )
    "
  >
    <span
      aria-hidden="true"
      class="mr-2 text-sm font-semibold select-none text-muted-foreground group-focus-within:text-foreground"
    >
      Rp
    </span>
    <input
      :id="id"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      enterkeyhint="done"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="displayValue"
      :aria-invalid="invalid"
      class="h-full w-full bg-transparent text-base font-medium tabular-nums outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
      @input="handleInput"
    />
  </div>
</template>
