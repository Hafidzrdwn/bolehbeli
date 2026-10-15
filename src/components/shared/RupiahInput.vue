<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRupiahInput } from '@/composables/useRupiahInput'
import { cn } from '@/lib/utils'

interface Props {
  id?: string
  placeholder?: string
  invalid?: boolean
  disabled?: boolean
  variant?: 'default' | 'hero'
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  id: undefined,
  placeholder: '0',
  invalid: false,
  disabled: false,
  variant: 'default',
  class: undefined,
})

const modelValue = defineModel<number | null>({ default: null })
const inputRef = ref<HTMLInputElement | null>(null)

const { displayValue, handleInput } = useRupiahInput(
  modelValue,
  (val) => {
    modelValue.value = val
  },
)

const isHero = computed(() => props.variant === 'hero')

defineExpose({
  focus: () => inputRef.value?.focus(),
  select: () => inputRef.value?.select(),
})
</script>

<template>
  <div
    :class="
      cn(
        'group flex w-full items-center transition-[background-color,box-shadow]',
        !isHero && 'field h-11 pointer-fine:h-10 px-3.5',
        isHero &&
          'h-auto rounded-xl bg-transparent px-2 py-1 hover:bg-transparent focus-within:bg-[color-mix(in_oklab,var(--foreground)_8%,transparent)] focus-within:ring-2 focus-within:ring-ring/45',
        invalid && 'ring-2 ring-danger',
        disabled && 'cursor-not-allowed opacity-50',
        props.class,
      )
    "
  >
    <span
      aria-hidden="true"
      :class="
        cn(
          'select-none text-muted-foreground group-focus-within:text-foreground',
          !isHero && 'mr-2 text-sm font-semibold',
          isHero && 'mr-2 text-title font-semibold',
        )
      "
    >
      Rp
    </span>
    <input
      :id="id"
      ref="inputRef"
      type="text"
      inputmode="numeric"
      autocomplete="off"
      enterkeyhint="done"
      :placeholder="placeholder"
      :disabled="disabled"
      :value="displayValue"
      :aria-invalid="invalid"
      :class="
        cn(
          'w-full bg-transparent tabular-nums outline-none disabled:cursor-not-allowed',
          !isHero && 'h-full text-base font-medium',
          isHero && 'text-display font-semibold',
        )
      "
      @input="handleInput"
    />
  </div>
</template>
