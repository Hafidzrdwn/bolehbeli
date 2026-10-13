<script setup lang="ts">
import { computed } from 'vue'
import { formatIDR } from '@/lib/money'
import { cn } from '@/lib/utils'

interface Props {
  value: number
  tone?: 'default' | 'muted' | 'safe' | 'warning' | 'danger'
  signed?: boolean
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  tone: 'default',
  signed: false,
  class: undefined,
})

const toneClasses: Record<NonNullable<Props['tone']>, string> = {
  default: 'text-foreground',
  muted: 'text-muted-foreground',
  safe: 'text-safe-foreground font-semibold',
  warning: 'text-warning-foreground font-semibold',
  danger: 'text-danger-foreground font-semibold',
}

const formatted = computed(() => {
  const base = formatIDR(props.value)
  if (props.signed && props.value > 0) {
    return `+${base}`
  }
  return base
})
</script>

<template>
  <span :class="cn('tabular-nums font-medium', toneClasses[tone], props.class)">
    {{ formatted }}
  </span>
</template>
