<script setup lang="ts">
import { storeToRefs } from 'pinia'
import RupiahInput from '@/components/shared/RupiahInput.vue'
import { Label } from '@/components/ui/label'
import { useFinanceStore } from '@/stores/finance'

const store = useFinanceStore()
const { state } = storeToRefs(store)

function onMinDailyChange(val: number | null) {
  store.setMinDailyBudget(val ?? 0)
}
</script>

<template>
  <div class="space-y-1.5">
    <div class="space-y-0.5">
      <Label for="min-daily-input" class="text-sm font-semibold text-foreground">
        Batas Minimum Jatah Harian
      </Label>
      <p class="text-xs text-muted-foreground">
        Ambang batas jatah harian minimum sebelum memicu peringatan (standar: Rp 20.000/hari).
      </p>
    </div>

    <RupiahInput
      id="min-daily-input"
      :model-value="state.minDailyBudget"
      placeholder="Rp 20.000"
      @update:model-value="onMinDailyChange"
    />
  </div>
</template>
