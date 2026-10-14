<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import RupiahInput from '@/components/shared/RupiahInput.vue'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { formatIDR } from '@/lib/money'
import { useFinanceStore } from '@/stores/finance'

const store = useFinanceStore()
const { state, buffer } = storeToRefs(store)

const isAuto = ref(state.value.bufferThreshold === null)
const manualAmount = ref(state.value.bufferThreshold ?? buffer.value)

watch(
  () => state.value.bufferThreshold,
  (newVal) => {
    isAuto.value = newVal === null
    if (newVal !== null) {
      manualAmount.value = newVal
    }
  },
)

function onToggleAuto(checked: boolean) {
  isAuto.value = checked
  if (checked) {
    store.setBufferThreshold(null)
  } else {
    const initial = manualAmount.value > 0 ? manualAmount.value : buffer.value
    manualAmount.value = initial
    store.setBufferThreshold(initial)
  }
}

function onManualChange(val: number | null) {
  const numeric = val ?? 0
  manualAmount.value = numeric
  store.setBufferThreshold(numeric)
}

const autoBufferDesc = computed(() => {
  return `Formula otomatis menyisihkan 10% saldo (min. Rp 50.000). Nilai buffer saat ini: ${formatIDR(buffer.value)}.`
})
</script>

<template>
  <div class="space-y-3">
    <div class="flex items-center justify-between gap-4">
      <div class="space-y-0.5">
        <Label for="auto-buffer-switch" class="text-sm font-semibold text-foreground">
          Buffer Otomatis
        </Label>
        <p class="text-xs text-muted-foreground">
          Cadangan darurat otomatis berdasarkan saldo
        </p>
      </div>
      <Switch
        id="auto-buffer-switch"
        :checked="isAuto"
        aria-label="Aktifkan buffer otomatis"
        @update:checked="onToggleAuto"
      />
    </div>

    <p v-if="isAuto" class="text-xs text-muted-foreground">
      {{ autoBufferDesc }}
    </p>

    <div v-else class="space-y-1.5 pt-1">
      <Label for="manual-buffer-input" class="text-xs font-medium text-foreground">
        Nominal Buffer Manual
      </Label>
      <RupiahInput
        id="manual-buffer-input"
        :model-value="manualAmount"
        placeholder="Rp 0"
        @update:model-value="onManualChange"
      />
      <p class="text-xs text-muted-foreground">
        Keputusan belanja akan memperingatkan jika saldo akhir di bawah nominal ini.
      </p>
    </div>
  </div>
</template>
