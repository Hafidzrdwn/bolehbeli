<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import RupiahInput from '@/components/shared/RupiahInput.vue'
import { useFinanceStore } from '@/stores/finance'

const store = useFinanceStore()
const { state, daysRemaining } = storeToRefs(store)

const balance = computed({
  get: () => state.value.currentBalance,
  set: (val: number | null) => {
    store.setBalance(val ?? 0)
  },
})
</script>

<template>
  <div class="space-y-1">
    <div class="flex items-center justify-between gap-2">
      <span class="text-section-label select-none">Saldo saat ini</span>
      <span class="text-meta text-muted-foreground tabular-nums select-none">
        Sisa {{ daysRemaining }} hari
      </span>
    </div>

    <RupiahInput
      id="balance-input"
      v-model="balance"
      variant="hero"
      placeholder="0"
    />
  </div>
</template>
