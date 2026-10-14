<script setup lang="ts">
import { computed, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { Wallet } from '@lucide/vue'
import EmptyState from '@/components/shared/EmptyState.vue'
import { Card } from '@/components/ui/card'
import { formatDateID } from '@/lib/date'
import { buildAllocation } from '@/lib/finance/allocation'
import { formatIDR } from '@/lib/money'
import { useFinanceStore } from '@/stores/finance'
import DecisionInsight from './DecisionInsight.vue'
import DecisionStatusBanner from './DecisionStatusBanner.vue'
import MetricCompareRow from './MetricCompareRow.vue'
import SanityMeter from './SanityMeter.vue'

const store = useFinanceStore()
const { state, decisionResult, totalNeeds, totalActiveWishlist } = storeToRefs(store)

const rootEl = ref<HTMLElement | null>(null)
defineExpose({ el: rootEl })

const isFreshState = computed(
  () =>
    state.value.currentBalance === 0 &&
    state.value.needs.length === 0 &&
    state.value.wishlist.length === 0,
)

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

const dailyDropText = computed(() => {
  if (decisionResult.value.dailyDrop <= 0) return undefined
  return `−${formatIDR(decisionResult.value.dailyDrop)}/hari`
})

const sisaDropText = computed(() => {
  if (totalActiveWishlist.value <= 0) return undefined
  return `−${formatIDR(totalActiveWishlist.value)}`
})

const dailyTone = computed<'safe' | 'warning' | 'danger' | 'neutral'>(() => {
  if (!decisionResult.value.hasSelection) return 'neutral'
  if (decisionResult.value.status === 'danger') return 'danger'
  if (
    decisionResult.value.dailyDropPercent > 40 ||
    decisionResult.value.reasons.includes('below_min_daily')
  ) {
    return 'warning'
  }
  return 'safe'
})

const sisaTone = computed<'safe' | 'warning' | 'danger' | 'neutral'>(() => {
  if (!decisionResult.value.hasSelection) return 'neutral'
  if (decisionResult.value.sisaFinal < 0) return 'danger'
  if (decisionResult.value.sisaFinal < decisionResult.value.buffer) return 'warning'
  return 'safe'
})
</script>

<template>
  <section ref="rootEl" aria-label="Hasil Analisis Belanja" class="w-full">
    <Card class="gap-5 border-primary/30 bg-accent p-4 text-accent-foreground shadow-sm sm:p-6">
      <EmptyState
        v-if="isFreshState"
        :icon="Wallet"
        title="Mulai dari saldo"
        description="Masukkan saldo uangmu saat ini di atas untuk mulai menghitung jatah harian dan mensimulasikan belanja."
      />

      <template v-else>
        <DecisionStatusBanner
          :status="decisionResult.status"
          :message="decisionResult.message"
        />

        <div class="rounded-xl border border-border/50 bg-card/80 p-3 sm:p-4">
          <MetricCompareRow
            label="Jatah per hari"
            :from="decisionResult.daily0"
            :to="decisionResult.dailyFinal"
            :diff-text="dailyDropText"
            :tone="dailyTone"
            :has-selection="decisionResult.hasSelection"
            unit="/hari"
          />

          <MetricCompareRow
            :label="sisaLabel"
            :from="decisionResult.sisa0"
            :to="decisionResult.sisaFinal"
            :diff-text="sisaDropText"
            :tone="sisaTone"
            :has-selection="decisionResult.hasSelection"
          />
        </div>

        <SanityMeter
          :allocation="allocation"
          :buffer="decisionResult.buffer"
        />

        <DecisionInsight
          :equivalent-days="decisionResult.equivalentDays"
          :has-selection="decisionResult.hasSelection"
          :balance="state.currentBalance"
        />
      </template>
    </Card>
  </section>
</template>
