<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { AlertTriangle, Calendar } from '@lucide/vue'
import { Popover, PopoverTrigger } from '@/components/ui/popover'
import { formatDateID } from '@/lib/date'
import { useFinanceStore } from '@/stores/finance'

const TargetDatePopoverContent = defineAsyncComponent(
  () => import('./TargetDatePopoverContent.vue'),
)

const store = useFinanceStore()
const { state, daysRemaining, isTargetPast } = storeToRefs(store)
const isOpen = ref(false)

const formattedDate = computed(() => formatDateID(state.value.targetDate))
</script>

<template>
  <Popover v-model:open="isOpen">
    <PopoverTrigger as-child>
      <button
        type="button"
        aria-label="Ubah target tanggal"
        :class="[
          'inline-flex h-9 items-center gap-2 rounded-full px-3.5 text-xs font-semibold transition-all select-none',
          isTargetPast
            ? 'bg-warning/15 text-warning-foreground hover:bg-warning/25'
            : 'bg-primary/10 text-primary hover:bg-primary/15',
        ]"
      >
        <component
          :is="isTargetPast ? AlertTriangle : Calendar"
          class="size-3.5 shrink-0"
          aria-hidden="true"
        />
        <span class="tabular-nums">
          {{ isTargetPast ? 'Tanggal sudah lewat · ' : 's/d ' }}{{ formattedDate }} · {{ daysRemaining }} hari
        </span>
      </button>
    </PopoverTrigger>

    <TargetDatePopoverContent v-if="isOpen" @close="isOpen = false" />
  </Popover>
</template>
