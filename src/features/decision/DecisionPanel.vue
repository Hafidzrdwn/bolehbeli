<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { formatDateID } from '@/lib/date'
import { buildAllocation } from '@/lib/finance/allocation'
import { useFinanceStore } from '@/stores/finance'
import DecisionHeadline from './DecisionHeadline.vue'
import DecisionInsight from './DecisionInsight.vue'
import DecisionStats from './DecisionStats.vue'
import KeyFigure from './KeyFigure.vue'
import SanityMeter from './SanityMeter.vue'

const store = useFinanceStore()
const { state, decisionResult, totalNeeds, totalActiveWishlist } = storeToRefs(store)

const rootEl = ref<HTMLElement | null>(null)
defineExpose({ el: rootEl })

const allocation = computed(() =>
  buildAllocation({
    balance: state.value.currentBalance,
    needsTotal: totalNeeds.value,
    wishlistTotal: totalActiveWishlist.value,
    buffer: decisionResult.value.buffer,
  }),
)

const sisaLabel = computed(() => {
  const formatted = formatDateID(state.value.targetDate)
  return formatted ? `Sisa uang sampai ${formatted}` : 'Sisa uang sampai target'
})
</script>

<template>
  <div
    ref="rootEl"
    :data-status="decisionResult.message.tone"
    class="relative flex flex-col gap-5 rounded-2xl bg-card/80 p-4 sm:p-5 hairline status-glow shadow-[0_1px_0_0_rgb(255_255_255/.6)_inset] dark:shadow-none dark:ring-1 dark:ring-white/5 transition-colors"
  >
    <DecisionHeadline
      :tone="decisionResult.message.tone"
      :emoji="decisionResult.message.emoji"
      :headline="decisionResult.message.headline"
      :detail="decisionResult.message.detail"
    />

    <KeyFigure
      :daily0="decisionResult.daily0"
      :daily-final="decisionResult.dailyFinal"
      :daily-drop="decisionResult.dailyDrop"
      :daily-drop-percent="decisionResult.dailyDropPercent"
      :has-selection="decisionResult.hasSelection"
      :tone="decisionResult.message.tone"
    />

    <SanityMeter
      :allocation="allocation"
      :buffer="decisionResult.buffer"
    />

    <DecisionStats
      :sisa-label="sisaLabel"
      :sisa0="decisionResult.sisa0"
      :sisa-final="decisionResult.sisaFinal"
      :buffer="decisionResult.buffer"
      :has-selection="decisionResult.hasSelection"
      :tone="decisionResult.message.tone"
    />

    <DecisionInsight
      :equivalent-days="decisionResult.equivalentDays"
      :has-selection="decisionResult.hasSelection"
      :balance="state.currentBalance"
    />
  </div>
</template>
