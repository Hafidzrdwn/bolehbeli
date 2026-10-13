<script setup lang="ts">
import { computed } from 'vue'
import { Sparkles } from '@lucide/vue'

interface Props {
  equivalentDays: number | null
  hasSelection: boolean
  balance: number
}

const props = defineProps<Props>()

const formattedDays = computed(() => {
  if (props.equivalentDays === null) return null
  return new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 1,
    minimumFractionDigits: 0,
  }).format(props.equivalentDays)
})

const insightText = computed(() => {
  if (props.hasSelection && formattedDays.value !== null) {
    return `Harga barang ini setara jatah hidupmu selama ${formattedDays.value} hari.`
  }
  if (!props.hasSelection && props.balance === 0) {
    return 'Isi saldo dulu untuk mulai simulasi.'
  }
  return null
})
</script>

<template>
  <div
    v-if="insightText"
    class="flex items-center gap-2.5 rounded-lg border border-border/50 bg-card/60 p-3 text-xs sm:text-sm text-foreground/90 transition-colors"
  >
    <Sparkles class="size-4 shrink-0 text-primary" aria-hidden="true" />
    <p class="leading-relaxed">
      {{ insightText }}
    </p>
  </div>
</template>
