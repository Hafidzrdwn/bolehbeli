<script setup lang="ts">
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { AlertCircle, Calendar } from '@lucide/vue'
import SectionCard from '@/components/shared/SectionCard.vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { useToday } from '@/composables/useToday'
import { endOfMonthISO, formatDateID, nextDayOfMonthISO } from '@/lib/date'
import { cn } from '@/lib/utils'
import { useFinanceStore } from '@/stores/finance'

const store = useFinanceStore()
const { state, isTargetPast } = storeToRefs(store)
const today = useToday()

const presets = computed(() => [
  { label: 'Akhir bulan', date: endOfMonthISO(today.value) },
  { label: 'Tgl 25', date: nextDayOfMonthISO(25, today.value) },
  { label: 'Tgl 1', date: nextDayOfMonthISO(1, today.value) },
])

const formattedTargetDate = computed(() => formatDateID(state.value.targetDate))

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
  <SectionCard title="Target tanggal" description="Batas akhir perhitungan alokasi uangmu">
    <div class="space-y-4">
      <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div class="space-y-1">
          <Label for="target-date-input" class="text-xs text-muted-foreground">
            Pilih tanggal
          </Label>
          <input
            id="target-date-input"
            type="date"
            :min="today"
            :value="state.targetDate"
            class="h-11 w-full rounded-lg border border-input bg-background px-3 text-base font-medium shadow-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/50"
            @change="handleDateChange"
          />
        </div>

        <div class="flex flex-col gap-1 sm:items-end">
          <span class="text-xs text-muted-foreground">Target aktif</span>
          <span class="flex items-center gap-1.5 text-sm font-semibold text-foreground">
            <Calendar class="size-4 text-primary" aria-hidden="true" />
            {{ formattedTargetDate }}
          </span>
        </div>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <span class="text-xs text-muted-foreground">Preset cepat:</span>
        <button
          v-for="preset in presets"
          :key="preset.label"
          type="button"
          :aria-pressed="state.targetDate === preset.date"
          :class="
            cn(
              'h-8 rounded-full border px-3 text-xs font-medium transition-colors select-none',
              state.targetDate === preset.date
                ? 'border-primary bg-primary/10 text-primary font-semibold'
                : 'border-border bg-background text-muted-foreground hover:bg-muted hover:text-foreground',
            )
          "
          @click="selectPreset(preset.date)"
        >
          {{ preset.label }}
        </button>
      </div>

      <div
        v-if="isTargetPast"
        role="alert"
        class="flex items-center justify-between gap-3 rounded-lg border border-warning/30 bg-warning/10 p-3 text-xs text-warning-foreground"
      >
        <div class="flex items-center gap-2">
          <AlertCircle class="size-4 shrink-0 text-warning" aria-hidden="true" />
          <span>Tanggal target sudah lewat. Hari ini dianggap hari terakhir.</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          class="h-7 shrink-0 border-warning/40 text-xs hover:bg-warning/20"
          @click="selectPreset(endOfMonthISO(today))"
        >
          Pilih Akhir Bulan
        </Button>
      </div>
    </div>
  </SectionCard>
</template>
