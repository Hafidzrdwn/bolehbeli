<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { AlertTriangle } from '@lucide/vue'
import { PopoverContent } from '@/components/ui/popover'
import { useToday } from '@/composables/useToday'
import { endOfMonthISO, nextDayOfMonthISO } from '@/lib/date'
import { useFinanceStore } from '@/stores/finance'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useFinanceStore()
const { state, isTargetPast } = storeToRefs(store)
const today = useToday()

const presets = computed(() => [
  { label: 'Akhir bulan', date: endOfMonthISO(today.value) },
  { label: 'Tgl 25', date: nextDayOfMonthISO(25, today.value) },
  { label: 'Tgl 1', date: nextDayOfMonthISO(1, today.value) },
])

function handleDateChange(event: Event): void {
  const target = event.target as HTMLInputElement
  if (target.value) {
    store.setTargetDate(target.value)
    emit('close')
  }
}

function selectPreset(date: string): void {
  store.setTargetDate(date)
  emit('close')
}
</script>

<template>
  <PopoverContent class="w-72 space-y-3">
    <div class="space-y-1">
      <span class="text-xs font-semibold text-muted-foreground uppercase">
        Pilihan Cepat
      </span>
      <div class="flex flex-wrap items-center gap-1.5 pt-1">
        <button
          v-for="preset in presets"
          :key="preset.label"
          type="button"
          :aria-pressed="state.targetDate === preset.date"
          :class="[
            'h-7 rounded-full px-2.5 text-xs font-medium transition-colors select-none',
            state.targetDate === preset.date
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground',
          ]"
          @click="selectPreset(preset.date)"
        >
          {{ preset.label }}
        </button>
      </div>
    </div>

    <div class="space-y-1 pt-1 border-t hairline">
      <label for="native-target-date" class="text-xs font-semibold text-muted-foreground uppercase">
        Pilih Tanggal Manual
      </label>
      <input
        id="native-target-date"
        type="date"
        :min="today"
        :value="state.targetDate"
        class="field h-10 w-full px-3 text-sm"
        @change="handleDateChange"
      />
    </div>

    <div
      v-if="isTargetPast"
      role="alert"
      class="rounded-xl bg-warning/10 p-2.5 text-xs text-warning-foreground flex items-center gap-2"
    >
      <AlertTriangle class="size-4 shrink-0 text-warning" aria-hidden="true" />
      <span>Tanggal target sudah lewat.</span>
    </div>
  </PopoverContent>
</template>
