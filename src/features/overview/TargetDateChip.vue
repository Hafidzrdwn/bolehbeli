<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { AlertTriangle, Calendar } from '@lucide/vue'
import { useToday } from '@/composables/useToday'
import { endOfMonthISO, formatDateID, nextDayOfMonthISO } from '@/lib/date'
import { useFinanceStore } from '@/stores/finance'

const store = useFinanceStore()
const { state, daysRemaining, isTargetPast } = storeToRefs(store)
const today = useToday()
const dateInputRef = ref<HTMLInputElement | null>(null)

const formattedDate = computed(() => formatDateID(state.value.targetDate))

const presets = computed(() => [
  { label: 'Akhir bulan', date: endOfMonthISO(today.value) },
  { label: 'Tgl 25', date: nextDayOfMonthISO(25, today.value) },
  { label: 'Tgl 1', date: nextDayOfMonthISO(1, today.value) },
])

function openPicker(): void {
  try {
    dateInputRef.value?.showPicker()
  } catch {
    dateInputRef.value?.focus()
  }
}

function handleDateChange(event: Event): void {
  const target = event.target as HTMLInputElement
  if (target.value) {
    store.setTargetDate(target.value)
  }
}

function selectPreset(date: string): void {
  store.setTargetDate(date)
}
</script>

<template>
  <div class="space-y-2">
    <div class="flex items-center gap-2">
      <button
        type="button"
        aria-label="Ubah target tanggal"
        :class="[
          'inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-semibold transition-all select-none',
          isTargetPast
            ? 'bg-warning/15 text-warning-foreground hover:bg-warning/25'
            : 'bg-primary/10 text-primary hover:bg-primary/15',
        ]"
        @click="openPicker"
      >
        <Calendar class="size-3.5 shrink-0" aria-hidden="true" />
        <span class="tabular-nums">
          {{ isTargetPast ? 'Tanggal lewat · ' : 's/d ' }}{{ formattedDate }} · {{ daysRemaining }} hari
        </span>
      </button>

      <input
        ref="dateInputRef"
        type="date"
        :min="today"
        :value="state.targetDate"
        class="sr-only"
        tabindex="-1"
        aria-hidden="true"
        @change="handleDateChange"
      />
    </div>

    <div class="flex flex-wrap items-center gap-1.5">
      <button
        v-for="preset in presets"
        :key="preset.label"
        type="button"
        :aria-pressed="state.targetDate === preset.date"
        :class="[
          'h-6 rounded-full px-2.5 text-[11px] font-medium transition-colors select-none',
          state.targetDate === preset.date
            ? 'bg-primary/15 text-primary font-semibold'
            : 'bg-foreground/5 text-muted-foreground hover:bg-foreground/10 hover:text-foreground',
        ]"
        @click="selectPreset(preset.date)"
      >
        {{ preset.label }}
      </button>
    </div>

    <div
      v-if="isTargetPast"
      role="alert"
      class="flex items-center justify-between gap-2 rounded-xl bg-warning/10 p-2.5 text-xs text-warning-foreground"
    >
      <div class="flex items-center gap-2 min-w-0">
        <AlertTriangle class="size-4 shrink-0 text-warning" aria-hidden="true" />
        <span class="truncate">Tanggal target sudah lewat.</span>
      </div>
      <button
        type="button"
        class="h-7 rounded-md px-2 text-xs font-medium text-warning-foreground transition-colors hover:bg-warning/20 shrink-0"
        @click="selectPreset(endOfMonthISO(today))"
      >
        Pilih Akhir Bulan
      </button>
    </div>
  </div>
</template>
