<script setup lang="ts">
import { computed, nextTick, ref } from 'vue'
import { X } from '@lucide/vue'
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

const emit = defineEmits<{
  (e: 'keydown', event: KeyboardEvent): void
  (e: 'blur', event: FocusEvent): void
}>()

const modelValue = defineModel<number | null>({ default: null })
const inputRef = ref<HTMLInputElement | null>(null)

const { displayValue, handleInput } = useRupiahInput(
  modelValue,
  (val) => {
    modelValue.value = val
  },
)

const isHero = computed(() => props.variant === 'hero')
const hasValue = computed(() => displayValue.value !== '' && displayValue.value !== '0')

function handleFocus(e: FocusEvent): void {
  const target = e.target as HTMLInputElement
  target.select()
  nextTick(() => {
    target.setSelectionRange(0, target.value.length)
  })
}

function handleKeydown(e: KeyboardEvent): void {
  if (e.key === 'Escape') {
    if (hasValue.value) {
      e.preventDefault()
      e.stopPropagation()
      modelValue.value = null
    } else {
      inputRef.value?.blur()
    }
  }
  emit('keydown', e)
}

function handleClear(): void {
  modelValue.value = null
  inputRef.value?.focus()
}

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
          'w-full min-w-0 bg-transparent tabular-nums outline-none disabled:cursor-not-allowed',
          !isHero && 'h-full text-base font-medium',
          isHero && 'text-display font-semibold',
        )
      "
      @input="handleInput"
      @focus="handleFocus"
      @blur="emit('blur', $event)"
      @keydown="handleKeydown"
    />
    <button
      v-if="hasValue && !disabled"
      type="button"
      tabindex="-1"
      aria-label="Hapus isi"
      class="ml-1.5 size-5 shrink-0 rounded-full flex items-center justify-center text-muted-foreground hover:text-foreground focus-visible:outline-none"
      @mousedown.prevent
      @click="handleClear"
    >
      <X class="size-3.5" aria-hidden="true" />
    </button>
  </div>
</template>
