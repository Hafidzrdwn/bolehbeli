<script setup lang="ts">
export interface SegmentOption {
  value: string
  label: string
  count?: number
}

interface Props {
  options: SegmentOption[]
}

const props = defineProps<Props>()
const modelValue = defineModel<string>({ required: true })

function handleKeydown(event: KeyboardEvent, index: number): void {
  const n = props.options.length
  let next = -1
  if (event.key === 'ArrowRight' || event.key === 'ArrowDown') next = (index + 1) % n
  else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') next = (index - 1 + n) % n
  else if (event.key === 'Home') next = 0
  else if (event.key === 'End') next = n - 1

  if (next >= 0) {
    event.preventDefault()
    const nextOption = props.options[next]
    if (nextOption) {
      modelValue.value = nextOption.value
      document.getElementById(`segment-tab-${nextOption.value}`)?.focus()
    }
  }
}
</script>

<template>
  <div
    role="tablist"
    class="relative flex h-11 w-full items-center rounded-xl bg-foreground/5 p-1 select-none"
  >
    <button
      v-for="(option, index) in options"
      :id="`segment-tab-${option.value}`"
      :key="option.value"
      type="button"
      role="tab"
      :aria-selected="modelValue === option.value"
      :tabindex="modelValue === option.value ? 0 : -1"
      :class="[
        'flex h-full flex-1 items-center justify-center gap-1.5 rounded-lg px-3 text-sm font-medium transition-all outline-none',
        modelValue === option.value
          ? 'hairline bg-background text-foreground font-semibold'
          : 'text-muted-foreground hover:text-foreground',
      ]"
      @click="modelValue = option.value"
      @keydown="handleKeydown($event, index)"
    >
      <span>{{ option.label }}</span>
      <span
        v-if="typeof option.count === 'number'"
        :class="[
          'rounded-full px-1.5 py-0.2 text-[10px] font-semibold tabular-nums',
          modelValue === option.value
            ? 'bg-primary/15 text-primary'
            : 'bg-foreground/10 text-muted-foreground',
        ]"
      >
        {{ option.count }}
      </span>
    </button>
  </div>
</template>
